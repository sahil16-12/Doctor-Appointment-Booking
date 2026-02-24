using backend.DTOs;

namespace backend.Services
{
    /// <summary>
    /// Defines business operations for appointment workflows.
    /// </summary>
    public interface IAppointmentService
    {
        #region Public Methods

        /// <summary>
        /// Retrieves available doctors for patient booking.
        /// </summary>
        /// <param name="patientUserId">The patient user identifier.</param>
        /// <returns>A tuple containing available doctors or error details.</returns>
        Task<(List<AvailableDoctorResponse>? response, ErrorResponse? error)> GetAvailableDoctorsAsync(int patientUserId);

        /// <summary>
        /// Creates appointment on behalf of patient.
        /// </summary>
        /// <param name="patientUserId">The patient user identifier.</param>
        /// <param name="request">The booking request payload.</param>
        /// <returns>A tuple containing appointment response or error details.</returns>
        Task<(AppointmentResponse? response, ErrorResponse? error)> CreateAppointmentAsync(int patientUserId, CreateAppointmentRequest request);

        /// <summary>
        /// Retrieves doctor pending appointments.
        /// </summary>
        /// <param name="doctorUserId">The doctor user identifier.</param>
        /// <returns>A tuple containing appointments list or error details.</returns>
        Task<(List<AppointmentResponse>? response, ErrorResponse? error)> GetPendingAppointmentsAsync(int doctorUserId);

        /// <summary>
        /// Applies approve or decline action for pending appointment.
        /// </summary>
        /// <param name="doctorUserId">The doctor user identifier.</param>
        /// <param name="appointmentId">The appointment identifier.</param>
        /// <param name="request">The decision request payload.</param>
        /// <returns>An error response when operation fails; otherwise null.</returns>
        Task<ErrorResponse?> DecideAppointmentAsync(int doctorUserId, int appointmentId, AppointmentDecisionRequest request);

        /// <summary>
        /// Cancels future appointment by doctor.
        /// </summary>
        /// <param name="doctorUserId">The doctor user identifier.</param>
        /// <param name="appointmentId">The appointment identifier.</param>
        /// <param name="request">The cancellation request payload.</param>
        /// <returns>An error response when operation fails; otherwise null.</returns>
        Task<ErrorResponse?> CancelFutureAppointmentAsync(int doctorUserId, int appointmentId, CancelAppointmentRequest request);

        #endregion
    }
}
