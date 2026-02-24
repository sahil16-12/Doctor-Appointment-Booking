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

        #endregion
    }
}
