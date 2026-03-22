using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories
{
    /// <summary>
    /// Provides persistence operations for appointment workflows.
    /// </summary>
    public class AppointmentRepository : IAppointmentRepository
    {
        #region Private Fields

        /// <summary>
        /// Represents application database context.
        /// </summary>
        private readonly ApplicationDbContext _context;

        #endregion

        #region Constructor

        /// <summary>
        /// Initializes a new instance of the <see cref="AppointmentRepository"/> class.
        /// </summary>
        /// <param name="context">The application database context.</param>
        public AppointmentRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        #endregion

        #region Public Methods

        /// <inheritdoc/>
        public async Task<List<TBL03>> GetAllDoctorsAsync()
        {
            return await _context.Doctors
                .Include(doctor => doctor.L03F07)
                .AsNoTracking()
                .ToListAsync();
        }

        /// <inheritdoc/>
        public async Task<TBL01?> FindUserByIdAsync(int userId)
        {
            return await _context.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(user => user.L01F01 == userId);
        }

        /// <inheritdoc/>
        public async Task<bool> DoesDoctorExistAsync(int doctorUserId)
        {
            return await _context.Doctors
                .AsNoTracking()
                .AnyAsync(doctor => doctor.L03F02 == doctorUserId);
        }

        /// <inheritdoc/>
        public async Task<bool> IsDoctorSlotOccupiedAsync(int doctorUserId, DateTime appointmentAtUtc)
        {
            return await _context.Appointments
                .AsNoTracking()
                .AnyAsync(appointment =>
                    appointment.L04F03 == doctorUserId &&
                    appointment.L04F04 == appointmentAtUtc &&
                    (appointment.L04F06 == AppointmentStatus.PENDING || appointment.L04F06 == AppointmentStatus.APPROVED));
        }

        /// <inheritdoc/>
        public async Task<bool> IsPatientDuplicateAppointmentAsync(int patientUserId, int doctorUserId, DateTime appointmentAtUtc)
        {
            return await _context.Appointments
                .AsNoTracking()
                .AnyAsync(appointment =>
                    appointment.L04F02 == patientUserId &&
                    appointment.L04F03 == doctorUserId &&
                    appointment.L04F04 == appointmentAtUtc &&
                    (appointment.L04F06 == AppointmentStatus.PENDING || appointment.L04F06 == AppointmentStatus.APPROVED));
        }

        /// <inheritdoc/>
        public async Task<int> CreateAppointmentAsync(TBL04 appointment)
        {
            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();
            return appointment.L04F01;
        }

        /// <inheritdoc/>
        public async Task<TBL04?> FindAppointmentByIdAsync(int appointmentId)
        {
            return await _context.Appointments
                .FirstOrDefaultAsync(appointment => appointment.L04F01 == appointmentId);
        }

        /// <inheritdoc/>
        public async Task<List<TBL04>> GetDoctorAppointmentsByStatusAsync(int doctorUserId, AppointmentStatus status)
        {
            return await _context.Appointments
                .AsNoTracking()
                .Where(appointment => appointment.L04F03 == doctorUserId && appointment.L04F06 == status)
                .OrderBy(appointment => appointment.L04F04)
                .ToListAsync();
        }

        /// <inheritdoc/>
        public async Task UpdateAppointmentAsync(TBL04 appointment)
        {
            _context.Appointments.Update(appointment);
            await _context.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public async Task<int> CreateAppointmentSlotAsync(TBL07 slot)
        {
            _context.AppointmentSlots.Add(slot);
            await _context.SaveChangesAsync();
            return slot.L07F01;
        }

        /// <inheritdoc/>
        public async Task<List<TBL07>> GetDoctorSlotsAsync(int doctorUserId, int? clinicId = null, bool includeBooked = true)
        {
            IQueryable<TBL07> query = _context.AppointmentSlots
                .Include(slot => slot.L07F09)
                .AsNoTracking()
                .Where(slot => slot.L07F02 == doctorUserId);

            if (clinicId.HasValue)
            {
                query = query.Where(slot => slot.L07F03 == clinicId.Value);
            }

            if (!includeBooked)
            {
                query = query.Where(slot => !slot.L07F06);
            }

            return await query
                .OrderBy(slot => slot.L07F04)
                .ToListAsync();
        }

        /// <inheritdoc/>
        public async Task<List<TBL07>> GetAvailableSlotsByDoctorAsync(int doctorUserId, int? clinicId = null)
        {
            IQueryable<TBL07> query = _context.AppointmentSlots
                .Include(slot => slot.L07F09)
                .AsNoTracking()
                .Where(slot => slot.L07F02 == doctorUserId && !slot.L07F06 && slot.L07F04 > DateTime.UtcNow);

            if (clinicId.HasValue)
            {
                query = query.Where(slot => slot.L07F03 == clinicId.Value);
            }

            return await query
                .OrderBy(slot => slot.L07F04)
                .ToListAsync();
        }

        /// <inheritdoc/>
        public async Task<TBL07?> FindSlotByIdAsync(int slotId)
        {
            return await _context.AppointmentSlots
                .Include(slot => slot.L07F09)
                .FirstOrDefaultAsync(slot => slot.L07F01 == slotId);
        }

        /// <inheritdoc/>
        public async Task DeleteSlotAsync(TBL07 slot)
        {
            _context.AppointmentSlots.Remove(slot);
            await _context.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public async Task MarkSlotAsBookedAsync(int slotId, bool isBooked)
        {
            TBL07? slot = await _context.AppointmentSlots.FindAsync(slotId);
            if (slot != null)
            {
                slot.L07F06 = isBooked;
                await _context.SaveChangesAsync();
            }
        }

        /// <inheritdoc/>
        public async Task<bool> DoesClinicExistAsync(int clinicId)
        {
            return await _context.Clinics
                .AsNoTracking()
                .AnyAsync(clinic => clinic.L05F01 == clinicId);
        }

        /// <summary>
        /// Gets all clinics where a doctor practices.
        /// </summary>
        /// <param name="doctorUserId">The doctor user identifier.</param>
        /// <returns>A list of clinics with consultation fees.</returns>
        public async Task<List<TBL06>> GetDoctorClinicsAsync(int doctorUserId)
        {
            return await _context.DoctorClinics
                .Include(dc => dc.L06F07)
                .AsNoTracking()
                .Where(dc => dc.L06F02 == doctorUserId)
                .ToListAsync();
        }

        /// <summary>
        /// Gets patient appointments for a specific status.
        /// </summary>
        /// <param name="patientUserId">The patient user identifier.</param>
        /// <param name="status">The status to filter.</param>
        /// <returns>A list of patient appointments matching the status.</returns>
        public async Task<List<TBL04>> GetPatientAppointmentsByStatusAsync(int patientUserId, AppointmentStatus status)
        {
            return await _context.Appointments
                .AsNoTracking()
                .Where(appointment => appointment.L04F02 == patientUserId && appointment.L04F06 == status)
                .OrderBy(appointment => appointment.L04F04)
                .ToListAsync();
        }

        /// <inheritdoc/>
        public async Task<TBL02?> GetPatientByUserIdAsync(int patientUserId)
        {
            return await _context.Patients
                .AsNoTracking()
                .FirstOrDefaultAsync(patient => patient.L02F02 == patientUserId);
        }

        #endregion
    }
}
