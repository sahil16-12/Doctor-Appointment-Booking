using backend.Models;

namespace backend.Repositories
{
    /// <summary>
    /// Defines persistence operations for appointment workflows.
    /// </summary>
    public interface IAppointmentRepository
    {
        #region Public Methods

        /// <summary>
        /// Retrieves all doctors with related user data.
        /// </summary>
        /// <returns>A list of doctor entities with user navigation loaded.</returns>
        Task<List<TBL03>> GetAllDoctorsAsync();

        /// <summary>
        /// Finds user by identifier.
        /// </summary>
        /// <param name="userId">The user identifier.</param>
        /// <returns>The matched user entity; otherwise null.</returns>
        Task<TBL01?> FindUserByIdAsync(int userId);

        /// <summary>
        /// Checks whether doctor profile exists for the given user.
        /// </summary>
        /// <param name="doctorUserId">The doctor user identifier.</param>
        /// <returns>True when doctor exists; otherwise false.</returns>
        Task<bool> DoesDoctorExistAsync(int doctorUserId);

        /// <summary>
        /// Checks whether doctor has pending or approved appointment at the same slot.
        /// </summary>
        /// <param name="doctorUserId">The doctor user identifier.</param>
        /// <param name="appointmentAtUtc">The appointment UTC date and time.</param>
        /// <returns>True when slot is already occupied; otherwise false.</returns>
        Task<bool> IsDoctorSlotOccupiedAsync(int doctorUserId, DateTime appointmentAtUtc);

        /// <summary>
        /// Checks whether patient already has same appointment request.
        /// </summary>
        /// <param name="patientUserId">The patient user identifier.</param>
        /// <param name="doctorUserId">The doctor user identifier.</param>
        /// <param name="appointmentAtUtc">The appointment UTC date and time.</param>
        /// <returns>True when duplicate appointment exists; otherwise false.</returns>
        Task<bool> IsPatientDuplicateAppointmentAsync(int patientUserId, int doctorUserId, DateTime appointmentAtUtc);

        /// <summary>
        /// Persists a new appointment and returns identifier.
        /// </summary>
        /// <param name="appointment">The appointment entity.</param>
        /// <returns>The created appointment identifier.</returns>
        Task<int> CreateAppointmentAsync(TBL04 appointment);

        /// <summary>
        /// Finds appointment by identifier.
        /// </summary>
        /// <param name="appointmentId">The appointment identifier.</param>
        /// <returns>The appointment entity when found; otherwise null.</returns>
        Task<TBL04?> FindAppointmentByIdAsync(int appointmentId);

        /// <summary>
        /// Retrieves doctor appointments for a specific status.
        /// </summary>
        /// <param name="doctorUserId">The doctor user identifier.</param>
        /// <param name="status">The status to filter.</param>
        /// <returns>A list of matching appointments.</returns>
        Task<List<TBL04>> GetDoctorAppointmentsByStatusAsync(int doctorUserId, AppointmentStatus status);

        /// <summary>
        /// Updates existing appointment entity.
        /// </summary>
        /// <param name="appointment">The appointment entity.</param>
        Task UpdateAppointmentAsync(TBL04 appointment);

        /// <summary>
        /// Creates a new appointment slot and returns identifier.
        /// </summary>
        /// <param name="slot">The appointment slot entity.</param>
        /// <returns>The created slot identifier.</returns>
        Task<int> CreateAppointmentSlotAsync(TBL07 slot);

        /// <summary>
        /// Retrieves all appointment slots for a doctor, optionally filtered by clinic.
        /// </summary>
        /// <param name="doctorUserId">The doctor user identifier.</param>
        /// <param name="clinicId">Optional clinic identifier to filter slots.</param>
        /// <param name="includeBooked">Whether to include booked slots.</param>
        /// <returns>A list of appointment slots with clinic data.</returns>
        Task<List<TBL07>> GetDoctorSlotsAsync(int doctorUserId, int? clinicId = null, bool includeBooked = true);

        /// <summary>
        /// Retrieves available (not booked) appointment slots for a doctor.
        /// </summary>
        /// <param name="doctorUserId">The doctor user identifier.</param>
        /// <param name="clinicId">Optional clinic identifier to filter slots.</param>
        /// <returns>A list of available appointment slots.</returns>
        Task<List<TBL07>> GetAvailableSlotsByDoctorAsync(int doctorUserId, int? clinicId = null);

        /// <summary>
        /// Finds an appointment slot by identifier.
        /// </summary>
        /// <param name="slotId">The slot identifier.</param>
        /// <returns>The slot entity when found; otherwise null.</returns>
        Task<TBL07?> FindSlotByIdAsync(int slotId);

        /// <summary>
        /// Deletes an appointment slot.
        /// </summary>
        /// <param name="slot">The slot entity to delete.</param>
        Task DeleteSlotAsync(TBL07 slot);

        /// <summary>
        /// Marks a slot as booked or available.
        /// </summary>
        /// <param name="slotId">The slot identifier.</param>
        /// <param name="isBooked">Whether the slot is booked.</param>
        Task MarkSlotAsBookedAsync(int slotId, bool isBooked);

        /// <summary>
        /// Checks if a clinic exists by identifier.
        /// </summary>
        /// <param name="clinicId">The clinic identifier.</param>
        /// <returns>True if clinic exists; otherwise false.</returns>
        Task<bool> DoesClinicExistAsync(int clinicId);

        /// <summary>
        /// Retrieves all clinics where a doctor practices.
        /// </summary>
        /// <param name="doctorUserId">The doctor user identifier.</param>
        /// <returns>A list of doctor-clinic mappings with clinic data.</returns>
        Task<List<TBL06>> GetDoctorClinicsAsync(int doctorUserId);

        /// <summary>
        /// Retrieves patient appointments for a specific status.
        /// </summary>
        /// <param name="patientUserId">The patient user identifier.</param>
        /// <param name="status">The status to filter.</param>
        /// <returns>A list of matching appointments.</returns>
        Task<List<TBL04>> GetPatientAppointmentsByStatusAsync(int patientUserId, AppointmentStatus status);

        /// <summary>
        /// Finds patient profile by user identifier.
        /// </summary>
        /// <param name="patientUserId">The patient user identifier.</param>
        /// <returns>The patient entity when found; otherwise null.</returns>
        Task<TBL02?> GetPatientByUserIdAsync(int patientUserId);

        #endregion
    }
}
