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
        /// Prepares appointment creation workflow by mapping request DTO to entity.
        /// </summary>
        /// <param name="patientUserId">The patient user identifier.</param>
        /// <param name="request">The booking request payload.</param>
        /// <returns>A tuple containing mapped appointment entity or error details.</returns>
        Task<(Models.TBL04? appointment, ErrorResponse? error)> CreateAppointmentPresaveAsync(int patientUserId, CreateAppointmentRequest request);

        /// <summary>
        /// Validates prepared appointment workflow state and business rules.
        /// </summary>
        /// <returns>An error response when validation fails; otherwise null.</returns>
        Task<ErrorResponse?> CreateAppointmentValidateAsync();

        /// <summary>
        /// Persists validated appointment creation workflow state.
        /// </summary>
        /// <returns>A tuple containing created appointment response or error details.</returns>
        Task<(AppointmentResponse? response, ErrorResponse? error)> CreateAppointmentSaveAsync();

        /// <summary>
        /// Retrieves doctor pending appointments.
        /// </summary>
        /// <param name="doctorUserId">The doctor user identifier.</param>
        /// <returns>A tuple containing appointments list or error details.</returns>
        Task<(List<AppointmentResponse>? response, ErrorResponse? error)> GetPendingAppointmentsAsync(int doctorUserId);

        /// <summary>
        /// Prepares decide appointment workflow state.
        /// </summary>
        /// <param name="doctorUserId">The doctor user identifier.</param>
        /// <param name="appointmentId">The appointment identifier.</param>
        /// <param name="request">The decision request payload.</param>
        /// <returns>An error response when operation fails; otherwise null.</returns>
        Task<ErrorResponse?> DecideAppointmentPresaveAsync(int doctorUserId, int appointmentId, AppointmentDecisionRequest request);

        /// <summary>
        /// Validates decide appointment workflow state and business rules.
        /// </summary>
        /// <returns>An error response when validation fails; otherwise null.</returns>
        Task<ErrorResponse?> DecideAppointmentValidateAsync();

        /// <summary>
        /// Persists decide appointment workflow state.
        /// </summary>
        /// <returns>An error response when save fails; otherwise null.</returns>
        Task<ErrorResponse?> DecideAppointmentSaveAsync();

        /// <summary>
        /// Prepares cancel future appointment workflow state.
        /// </summary>
        /// <param name="doctorUserId">The doctor user identifier.</param>
        /// <param name="appointmentId">The appointment identifier.</param>
        /// <param name="request">The cancellation request payload.</param>
        /// <returns>An error response when operation fails; otherwise null.</returns>
        Task<ErrorResponse?> CancelFutureAppointmentPresaveAsync(int doctorUserId, int appointmentId, CancelAppointmentRequest request);

        /// <summary>
        /// Validates cancel future appointment workflow state and business rules.
        /// </summary>
        /// <returns>An error response when validation fails; otherwise null.</returns>
        Task<ErrorResponse?> CancelFutureAppointmentValidateAsync();

        /// <summary>
        /// Persists cancel future appointment workflow state.
        /// </summary>
        /// <returns>An error response when save fails; otherwise null.</returns>
        Task<ErrorResponse?> CancelFutureAppointmentSaveAsync();

        #endregion
    }
}
