using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;

namespace backend.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> CreateUserAsync(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user.Id;
        }

        public async Task CreatePatientAsync(Patient patient)
        {
            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();
        }

        public async Task CreateDoctorAsync(Doctor doctor)
        {
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> FindUserByEmailAsync(string email)
        {
            return await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<PatientProfile?> FindPatientByUserIdAsync(int userId)
        {
            var result = await _context.Users
                .Where(u => u.Id == userId)
                .Join(_context.Patients,
                    u => u.Id,
                    p => p.UserId,
                    (u, p) => new PatientProfile
                    {
                        Id = u.Id,
                        UserType = u.UserType,
                        FullName = u.FullName,
                        Email = u.Email,
                        Phone = u.Phone,
                        Dob = u.Dob,
                        CreatedAt = u.CreatedAt,
                        EmergencyContact = p.EmergencyContact,
                        Allergies = p.Allergies
                    })
                .FirstOrDefaultAsync();

            return result;
        }

        public async Task<DoctorProfile?> FindDoctorByUserIdAsync(int userId)
        {
            var result = await _context.Users
                .Where(u => u.Id == userId)
                .Join(_context.Doctors,
                    u => u.Id,
                    d => d.UserId,
                    (u, d) => new DoctorProfile
                    {
                        Id = u.Id,
                        UserType = u.UserType,
                        FullName = u.FullName,
                        Email = u.Email,
                        Phone = u.Phone,
                        Dob = u.Dob,
                        CreatedAt = u.CreatedAt,
                        Specialization = d.Specialization,
                        LicenseNumber = d.LicenseNumber,
                        YearsExperience = d.YearsExperience
                    })
                .FirstOrDefaultAsync();

            return result;
        }
    }
}
