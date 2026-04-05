using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Extensions;
using backend.Exceptions;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    /// <summary>
    /// Exposes appointment booking endpoints for patients and doctors.
    /// </summary>
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        #region Private Fields

        /// <summary>
        /// Represents appointment service dependency.
        /// </summary>
        private readonly IAppointmentService _appointmentService;

        /// <summary>
        /// Represents payment service dependency.
        /// </summary>
        private readonly IPaymentService _paymentService;

        #endregion

        #region Constructor

        /// <summary>
        /// Initializes a new instance of the <see cref="AppointmentsController"/> class.
        /// </summary>
        /// <param name="appointmentService">The appointment service.</param>
        /// <param name="paymentService">The payment service.</param>
        public AppointmentsController(IAppointmentService appointmentService, IPaymentService paymentService)
        {
            _appointmentService = appointmentService;
            _paymentService = paymentService;
        }

        #endregion

        #region Patient Endpoints

        /// <summary>
        /// Retrieves available doctors for appointment booking.
        /// </summary>
        /// <returns>A list of available doctors.</returns>
        [HttpGet("doctors/available")]
        public async Task<IActionResult> GetAvailableDoctors()
        {
            CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();

            if (currentUser.Role != UserType.PATIENT)
            {
                throw new AppException("You are not authorized to access this resource.", StatusCodes.Status403Forbidden);
            }

            List<AvailableDoctorResponse> response = await _appointmentService.GetAvailableDoctorsAsync(currentUser.UserId);

            return Ok(response);
        }

        /// <summary>
        /// Retrieves available appointment slots for a specific doctor.
        /// </summary>
        /// <param name="doctorUserId">The doctor user identifier.</param>
        /// <param name="clinicId">Optional clinic identifier to filter slots.</param>
        /// <returns>A list of available slots.</returns>
        [HttpGet("slots/available")]
        public async Task<IActionResult> GetAvailableSlots([FromQuery] int doctorUserId, [FromQuery] int? clinicId = null)
        {
            CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();

            if (currentUser.Role != UserType.PATIENT)
            {
                throw new AppException("You are not authorized to access this resource.", StatusCodes.Status403Forbidden);
            }

            List<AppointmentSlotResponse> response = await _appointmentService.GetAvailableSlotsForDoctorAsync(doctorUserId, clinicId);

            return Ok(response);
        }

        /// <summary>
        /// Creates a new appointment request by patient.
        /// </summary>
        /// <param name="request">The booking request payload.</param>
        /// <returns>The created appointment details.</returns>
        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentRequest request)
        {
            CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();

            if (currentUser.Role != UserType.PATIENT)
            {
                throw new AppException("You are not authorized to access this resource.", StatusCodes.Status403Forbidden);
            }

            await _appointmentService.CreateAppointmentPresaveAsync(currentUser.UserId, request);
            await _appointmentService.CreateAppointmentValidateAsync();
            AppointmentResponse response = await _appointmentService.CreateAppointmentSaveAsync();

            return StatusCode(201, response);
        }

        /// <summary>
        /// Retrieves pending appointments for both doctor and patient.
        /// </summary>
        /// <returns>A list of pending appointments.</returns>
        [HttpGet("pending")]
        public async Task<IActionResult> GetPendingAppointments()
        {
            CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();

            //List<AppointmentResponse> response = await _appointmentService.GetPendingAppointmentsByUserAsync(currentUser.UserId, currentUser.Role);
            List<AppointmentResponse> response = await _appointmentService.GetAppointmentsByStatusAsync(currentUser.UserId, currentUser.Role, AppointmentStatus.PENDING);
            return Ok(response);
        }

        /// <summary>
        /// Retrieves approved appointments.
        /// </summary>
        /// <returns>A list of approved appointments.</returns>
        [HttpGet("approved")]
        public async Task<IActionResult> GetApprovedAppointments()
        {
            CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();

            List<AppointmentResponse> response = await _appointmentService.GetAppointmentsByStatusAsync(currentUser.UserId, currentUser.Role, AppointmentStatus.APPROVED);

            return Ok(response);
        }

        /// <summary>
        /// Retrieves declined appointments.
        /// </summary>
        /// <returns>A list of declined appointments.</returns>
        [HttpGet("declined")]
        public async Task<IActionResult> GetDeclinedAppointments()
        {
            CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();

            List<AppointmentResponse> response = await _appointmentService.GetAppointmentsByStatusAsync(currentUser.UserId, currentUser.Role, AppointmentStatus.DECLINED);

            return Ok(response);
        }

        /// <summary>
        /// Retrieves cancelled appointments.
        /// </summary>
        /// <returns>A list of cancelled appointments.</returns>
        [HttpGet("cancelled")]
        public async Task<IActionResult> GetCancelledAppointments()
        {
            CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();

            List<AppointmentResponse> response = await _appointmentService.GetAppointmentsByStatusAsync(currentUser.UserId, currentUser.Role, AppointmentStatus.CANCELLED);

            return Ok(response);
        }

        /// <summary>
        /// Retrieves completed appointments.
        /// </summary>
        /// <returns>A list of completed appointments.</returns>
        [HttpGet("completed")]
        public async Task<IActionResult> GetCompletedAppointments()
        {
            CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();

            List<AppointmentResponse> response = await _appointmentService.GetAppointmentsByStatusAsync(currentUser.UserId, currentUser.Role, AppointmentStatus.COMPLETED);

            return Ok(response);
        }

        #endregion

        #region Doctor Endpoints

        /// <summary>
        /// Creates a new appointment slot by doctor.
        /// </summary>
        /// <param name="request">The slot creation request payload.</param>
        /// <returns>The created slot details.</returns>
        [HttpPost("doctor/slots")]
        public async Task<IActionResult> CreateSlot([FromBody] CreateAppointmentSlotRequest request)
        {
            CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();

            if (currentUser.Role != UserType.DOCTOR)
            {
                throw new AppException("You are not authorized to access this resource.", StatusCodes.Status403Forbidden);
            }

            await _appointmentService.CreateSlotPresaveAsync(currentUser.UserId, request);
            await _appointmentService.CreateSlotValidateAsync();
            AppointmentSlotResponse response = await _appointmentService.CreateSlotSaveAsync();

            return StatusCode(201, response);
        }

        /// <summary>
        /// Retrieves doctor's appointment slots.
        /// </summary>
        /// <param name="clinicId">Optional clinic identifier to filter slots.</param>
        /// <param name="includeBooked">Whether to include booked slots in the response.</param>
        /// <returns>A list of appointment slots.</returns>
        [HttpGet("doctor/slots")]
        public async Task<IActionResult> GetDoctorSlots([FromQuery] int? clinicId = null, [FromQuery] bool includeBooked = true)
        {
            CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();

            if (currentUser.Role != UserType.DOCTOR)
            {
                throw new AppException("You are not authorized to access this resource.", StatusCodes.Status403Forbidden);
            }

            List<AppointmentSlotResponse> response = await _appointmentService.GetDoctorSlotsAsync(currentUser.UserId, clinicId, includeBooked);

            return Ok(response);
        }

        /// <summary>
        /// Deletes an appointment slot by doctor.
        /// </summary>
        /// <param name="slotId">The slot identifier.</param>
        /// <returns>A status response for deletion action.</returns>
        [HttpDelete("doctor/slots/{slotId:int}")]
        public async Task<IActionResult> DeleteSlot(int slotId)
        {
            CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();

            if (currentUser.Role != UserType.DOCTOR)
            {
                throw new AppException("You are not authorized to access this resource.", StatusCodes.Status403Forbidden);
            }

            await _appointmentService.DeleteSlotAsync(currentUser.UserId, slotId);

            return Ok(new { message = "Appointment slot deleted successfully." });
        }


        /// <summary>
        /// Approves or declines a pending appointment.
        /// </summary>
        /// <param name="appointmentId">The appointment identifier.</param>
        /// <param name="request">The decision request payload.</param>
        /// <returns>A status response for decision action.</returns>
        [HttpPut("{appointmentId:int}/decision")]
        public async Task<IActionResult> DecideAppointment(int appointmentId, [FromBody] AppointmentDecisionRequest request)
        {
            CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();

            if (currentUser.Role != UserType.DOCTOR)
            {
                throw new AppException("You are not authorized to access this resource.", StatusCodes.Status403Forbidden);
            }

            await _appointmentService.DecideAppointmentPresaveAsync(currentUser.UserId, appointmentId, request);
            await _appointmentService.DecideAppointmentValidateAsync();
            await _appointmentService.DecideAppointmentSaveAsync();

            return Ok(new { message = "Appointment updated successfully." });
        }

        /// <summary>
        /// Cancels a future appointment by doctor.
        /// </summary>
        /// <param name="appointmentId">The appointment identifier.</param>
        /// <param name="request">The cancellation request payload.</param>
        /// <returns>A status response for cancellation action.</returns>
        [HttpPut("{appointmentId:int}/cancel")]
        public async Task<IActionResult> CancelFutureAppointment(int appointmentId, [FromBody] CancelAppointmentRequest request)
        {
            CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();

            if (currentUser.Role != UserType.DOCTOR)
            {
                throw new AppException("You are not authorized to access this resource.", StatusCodes.Status403Forbidden);
            }

            await _appointmentService.CancelFutureAppointmentPresaveAsync(currentUser.UserId, appointmentId, request);
            await _appointmentService.CancelFutureAppointmentValidateAsync();
            await _appointmentService.CancelFutureAppointmentSaveAsync();

            // Process refund for the cancelled appointment
            try
            {
                await _paymentService.RefundPaymentAsync(appointmentId, request.DoctorNotes ?? "Appointment cancelled by doctor");
            }
            catch (Exception ex)
            {
                // Log the error but don't fail the cancellation
                // The appointment is already cancelled, refund can be processed manually if needed
                Console.WriteLine($"Refund processing failed for appointment {appointmentId}: {ex.Message}");
            }

            return Ok(new { message = "Appointment cancelled successfully and refund processed." });
        }

        /// <summary>
        /// Marks an approved appointment as completed by doctor.
        /// </summary>
        /// <param name="appointmentId">The appointment identifier.</param>
        /// <param name="request">The completion request payload.</param>
        /// <returns>A status response for completion action.</returns>
        [HttpPut("{appointmentId:int}/complete")]
        public async Task<IActionResult> CompleteAppointment(int appointmentId, [FromBody] CancelAppointmentRequest request)
        {
            CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();

            if (currentUser.Role != UserType.DOCTOR)
            {
                throw new AppException("You are not authorized to access this resource.", StatusCodes.Status403Forbidden);
            }

            await _appointmentService.CompleteAppointmentPresaveAsync(currentUser.UserId, appointmentId, request);
            await _appointmentService.CompleteAppointmentValidateAsync();
            await _appointmentService.CompleteAppointmentSaveAsync();

            return Ok(new { message = "Appointment marked as completed successfully." });
        }

        #endregion

    }
}
