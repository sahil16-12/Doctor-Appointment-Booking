using backend.Data;
using backend.Exceptions;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories
{
    /// <summary>
    /// Provides prescription data access operations using Entity Framework Core.
    /// </summary>
    public class PrescriptionRepository : IPrescriptionRepository
    {
        #region Private Fields

        /// <summary>
        /// Represents the database context dependency.
        /// </summary>
        private readonly ApplicationDbContext _context;

        #endregion

        #region Constructor

        /// <summary>
        /// Initializes a new instance of the <see cref="PrescriptionRepository"/> class.
        /// </summary>
        /// <param name="context">The application database context.</param>
        public PrescriptionRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        #endregion

        #region Public Methods

        /// <inheritdoc/>
        public async Task<TBL08?> FindPrescriptionByIdAsync(int prescriptionId)
        {
            return await _context.Prescriptions.FindAsync(prescriptionId);
        }

        /// <inheritdoc/>
        public async Task<List<TBL08>> GetPatientPrescriptionsAsync(int patientUserId)
        {
            return await _context.Prescriptions
                .Where(p => p.L08F04 == patientUserId)
                .OrderByDescending(p => p.L08F10)
                .ToListAsync();
        }

        /// <inheritdoc/>
        public async Task<List<TBL08>> GetDoctorIssuedPrescriptionsAsync(int doctorUserId)
        {
            return await _context.Prescriptions
                .Where(p => p.L08F03 == doctorUserId)
                .OrderByDescending(p => p.L08F10)
                .ToListAsync();
        }

        /// <inheritdoc/>
        public async Task<List<TBL08>> GetAppointmentPrescriptionsAsync(int appointmentId)
        {
            return await _context.Prescriptions
                .Where(p => p.L08F02 == appointmentId)
                .ToListAsync();
        }

        /// <inheritdoc/>
        public async Task CreatePrescriptionAsync(TBL08 prescription)
        {
            await _context.Prescriptions.AddAsync(prescription);
            await _context.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public async Task UpdatePrescriptionAsync(TBL08 prescription)
        {
            _context.Prescriptions.Update(prescription);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch(Exception e)
            {
                throw new AppException(e.InnerException.ToString(), 400);
            }
        }

        /// <inheritdoc/>
        public async Task DeletePrescriptionAsync(int prescriptionId)
        {
            var prescription = await FindPrescriptionByIdAsync(prescriptionId);
            if (prescription != null)
            {
                _context.Prescriptions.Remove(prescription);
                await _context.SaveChangesAsync();
            }
        }

        #endregion
    }
}
