using backend.DTOs;

namespace backend.Services;

public interface IPaymentService
{
    Task<PaymentIntentResponse> CreatePaymentIntentAsync(int patientUserId, CreatePaymentIntentRequest request);
    Task<PaymentResponse> ConfirmPaymentAndCreateAppointmentAsync(int patientUserId, ConfirmPaymentRequest request);
    Task<PaymentResponse> GetPaymentByAppointmentIdAsync(int appointmentId, int userId, string userRole);
    Task<List<PaymentResponse>> GetMyPaymentsAsync(int userId, string userRole);
    Task RefundPaymentAsync(int appointmentId, string reason);
    Task<DoctorEarningsResponse> GetDoctorEarningsAsync(int doctorUserId);
}
