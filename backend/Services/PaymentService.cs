using backend.DTOs;
using backend.Models;
using backend.Repositories;
using Microsoft.Extensions.Options;
using Stripe;
using backend.Mapping;


namespace backend.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IRefundRepository _refundRepository;
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly IDoctorRepository _doctorRepository;
    private readonly IAppointmentService _appointmentService;
    private readonly IReflectionMapper _mapper;
    private readonly StripeSettings _stripeSettings;

    public PaymentService(
        IPaymentRepository paymentRepository,
        IRefundRepository refundRepository,
        IAppointmentRepository appointmentRepository,
        IDoctorRepository doctorRepository,
        IAppointmentService appointmentService,
        IReflectionMapper mapper,
        IOptions<StripeSettings> stripeSettings)
    {
        _paymentRepository = paymentRepository;
        _refundRepository = refundRepository;
        _appointmentRepository = appointmentRepository;
        _doctorRepository = doctorRepository;
        _appointmentService = appointmentService;
        _mapper = mapper;
        _stripeSettings = stripeSettings.Value;
        
        StripeConfiguration.ApiKey = _stripeSettings.SecretKey;
    }

    public async Task<PaymentIntentResponse> CreatePaymentIntentAsync(int patientUserId, CreatePaymentIntentRequest request)
    {
        // Get slot details to find clinic
        var slot = await _appointmentRepository.FindSlotByIdAsync(request.SlotId);
        if (slot == null)
        {
            throw new InvalidOperationException("Slot not found");
        }

        // Get doctor-clinic relationships
        var doctorClinics = await _doctorRepository.GetDoctorClinicsAsync(request.DoctorUserId);
        var doctorClinic = doctorClinics.FirstOrDefault(dc => dc.L06F03 == slot.L07F03);
        
        if (doctorClinic == null)
        {
            throw new InvalidOperationException("Doctor is not associated with this clinic");
        }

        // Get doctor to access default consultation fee
        var doctor = await _doctorRepository.GetDoctorByUserIdAsync(request.DoctorUserId);
        if (doctor == null)
        {
            throw new InvalidOperationException("Doctor not found");
        }

        // Get consultation fee (clinic-specific if available, otherwise doctor's default)
        var consultationFee = doctorClinic.L06F04 ?? doctor.L03F10;
        if (consultationFee <= 0)
        {
            throw new InvalidOperationException("Consultation fee not set for this doctor");
        }

        // Convert to paise (smallest unit for INR)
        var amountCents = (long)(consultationFee * 100);

        // Get doctor name
        var doctorUser = doctor?.L03F07;
        var doctorName = doctorUser != null 
            ? $"Dr. {doctorUser.L01F02} {doctorUser.L01F03}" 
            : "Doctor";

        // Create Stripe PaymentIntent
        var options = new PaymentIntentCreateOptions
        {
            Amount = amountCents,
            Currency = _stripeSettings.Currency,
            AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
            {
                Enabled = true,
            },
            Metadata = new Dictionary<string, string>
            {
                { "patient_user_id", patientUserId.ToString() },
                { "doctor_user_id", request.DoctorUserId.ToString() },
                { "slot_id", request.SlotId.ToString() },
                { "reason", request.Reason }
            }
        };

        var service = new PaymentIntentService();
        var paymentIntent = await service.CreateAsync(options);

        return new PaymentIntentResponse
        {
            ClientSecret = paymentIntent.ClientSecret,
            PaymentIntentId = paymentIntent.Id,
            AmountCents = amountCents,
            Currency = _stripeSettings.Currency,
            DoctorName = doctorName,
            ConsultationFee = consultationFee
        };
    }

    public async Task<PaymentResponse> ConfirmPaymentAndCreateAppointmentAsync(int patientUserId, ConfirmPaymentRequest request)
    {
        // Verify payment intent with Stripe
        var service = new PaymentIntentService();
        var paymentIntent = await service.GetAsync(request.PaymentIntentId);

        if (paymentIntent == null)
        {
            throw new InvalidOperationException("Payment intent not found");
        }

        if (paymentIntent.Status != "succeeded")
        {
            throw new InvalidOperationException($"Payment not completed. Status: {paymentIntent.Status}");
        }

        // Check if payment already recorded
        var existingPayment = await _paymentRepository.GetByPaymentIntentIdAsync(request.PaymentIntentId);
        if (existingPayment != null)
        {
            // Payment already processed, return existing appointment
            return _mapper.Map<TBL10, PaymentResponse>(existingPayment);
        }

        // Create appointment using existing service
        var appointmentRequest = new CreateAppointmentRequest
        {
            DoctorUserId = request.DoctorUserId,
            SlotId = request.SlotId,
            Reason = request.Reason
        };

        await _appointmentService.CreateAppointmentPresaveAsync(patientUserId, appointmentRequest);
        await _appointmentService.CreateAppointmentValidateAsync();
        var appointmentResponse = await _appointmentService.CreateAppointmentSaveAsync();

        // Get the latest charge from PaymentIntent
        var latestCharge = paymentIntent.LatestCharge;
        var chargeId = latestCharge is Stripe.Charge charge ? charge.Id : null;
        var paymentMethodType = latestCharge is Stripe.Charge chargeObj 
            ? chargeObj.PaymentMethodDetails?.Type ?? "card" 
            : "card";

        // Record payment in database
        var payment = new TBL10
        {
            L10F02 = appointmentResponse.AppointmentId,
            L10F03 = patientUserId,
            L10F04 = request.DoctorUserId,
            L10F05 = paymentIntent.Amount,
            L10F06 = paymentIntent.Currency.ToUpper(),
            L10F07 = paymentIntent.Id,
            L10F08 = chargeId,
            L10F09 = "SUCCEEDED",
            L10F10 = paymentMethodType
        };

        var createdPayment = await _paymentRepository.CreateAsync(payment);

        return _mapper.Map<TBL10, PaymentResponse>(createdPayment);
    }

    public async Task<PaymentResponse> GetPaymentByAppointmentIdAsync(int appointmentId, int userId, string userRole)
    {
        var payment = await _paymentRepository.GetByAppointmentIdAsync(appointmentId);
        if (payment == null)
        {
            throw new InvalidOperationException("Payment not found for this appointment");
        }

        // Authorization check
        if (userRole == "PATIENT" && payment.L10F03 != userId)
        {
            throw new UnauthorizedAccessException("You can only view your own payments");
        }
        else if (userRole == "DOCTOR" && payment.L10F04 != userId)
        {
            throw new UnauthorizedAccessException("You can only view payments for your appointments");
        }

        return _mapper.Map<TBL10, PaymentResponse>(payment);
    }

    public async Task<List<PaymentResponse>> GetMyPaymentsAsync(int userId, string userRole)
    {
        List<TBL10> payments;

        if (userRole == "PATIENT")
        {
            payments = await _paymentRepository.GetByPatientIdAsync(userId);
        }
        else if (userRole == "DOCTOR")
        {
            payments = await _paymentRepository.GetByDoctorIdAsync(userId);
        }
        else
        {
            throw new InvalidOperationException("Invalid user role");
        }

        return payments.Select(p => _mapper.Map<TBL10, PaymentResponse>(p)).ToList();
    }

    public async Task RefundPaymentAsync(int appointmentId, string reason)
    {
        var payment = await _paymentRepository.GetByAppointmentIdAsync(appointmentId);
        if (payment == null)
        {
            throw new InvalidOperationException("Payment not found for this appointment");
        }

        if (payment.L10F09 != "SUCCEEDED")
        {
            throw new InvalidOperationException("Can only refund successful payments");
        }

        // Check if already refunded
        var existingRefund = await _refundRepository.GetByPaymentIdAsync(payment.L10F01);
        if (existingRefund != null)
        {
            throw new InvalidOperationException("Payment has already been refunded");
        }

        // Create Stripe refund
        var refundService = new RefundService();
        var refundOptions = new RefundCreateOptions
        {
            PaymentIntent = payment.L10F07,
            Reason = "requested_by_customer"
        };

        try
        {
            var stripeRefund = await refundService.CreateAsync(refundOptions);

            // Record refund in database
            var refund = new TBL11
            {
                L11F02 = payment.L10F01,
                L11F03 = appointmentId,
                L11F04 = payment.L10F05,
                L11F05 = stripeRefund.Id,
                L11F06 = stripeRefund.Status == "succeeded" ? "SUCCEEDED" : "PENDING",
                L11F07 = reason
            };

            await _refundRepository.CreateAsync(refund);

            // Update payment status if refund succeeded
            if (stripeRefund.Status == "succeeded")
            {
                payment.L10F09 = "REFUNDED";
                await _paymentRepository.UpdateAsync(payment);
            }
        }
        catch (StripeException ex)
        {
            // Record failed refund
            var refund = new TBL11
            {
                L11F02 = payment.L10F01,
                L11F03 = appointmentId,
                L11F04 = payment.L10F05,
                L11F05 = "FAILED",
                L11F06 = "FAILED",
                L11F07 = reason,
                L11F08 = ex.Message
            };

            await _refundRepository.CreateAsync(refund);
            throw new InvalidOperationException($"Refund failed: {ex.Message}");
        }
    }
}
