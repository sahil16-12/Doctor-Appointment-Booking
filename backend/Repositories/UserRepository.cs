using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;

namespace backend.Repositories
{
    /// <summary>
    /// Provides persistence operations for users, patients, and doctors.
    /// </summary>
    public class UserRepository : IUserRepository
    {
        #region Private Fields

        /// <summary>
        /// Represents the database context instance.
        /// </summary>
        private readonly ApplicationDbContext _context;

        #endregion

        #region Constructor

        /// <summary>
        /// Initializes a new instance of the <see cref="UserRepository"/> class.
        /// </summary>
        /// <param name="context">The application database context.</param>
        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        #endregion

        #region Public Methods

        /// <inheritdoc/>
        public async Task<int> CreateUserAsync(TBL01 user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user.L01F01;
        }

        /// <inheritdoc/>
        public async Task CreatePatientAsync(TBL02 patient)
        {
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public async Task CreateDoctorAsync(TBL03 doctor)
        {
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();
        }

        /// <inheritdoc/>
        public async Task<TBL01?> FindUserByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.L01F04 == email);
        }

        /// <inheritdoc/>
        public async Task<TBL02?> FindPatientByUserIdAsync(int userId)
        {
            return await _context.Patients
                .FirstOrDefaultAsync(patient => patient.L02F02 == userId);
        }

        /// <inheritdoc/>
        public async Task<TBL03?> FindDoctorByUserIdAsync(int userId)
        {
            return await _context.Doctors
                .FirstOrDefaultAsync(doctor => doctor.L03F02 == userId);
        }

        #endregion
    }
}
