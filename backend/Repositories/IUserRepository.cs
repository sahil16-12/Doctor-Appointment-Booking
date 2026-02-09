using backend.Models;
using backend.DTOs;

namespace backend.Repositories
{
    public interface IUserRepository
    {
        Task<int> CreateUserAsync(User user);
        Task CreatePatientAsync(Patient patient);
        Task CreateDoctorAsync(Doctor doctor);
        Task<User?> FindUserByEmailAsync(string email);
        Task<PatientProfile?> FindPatientByUserIdAsync(int userId);
        Task<DoctorProfile?> FindDoctorByUserIdAsync(int userId);
    }
}
