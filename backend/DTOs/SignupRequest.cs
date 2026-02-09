using backend.Models;

namespace backend.DTOs
{
    public class SignupRequest
    {
        public UserType UserType { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime Dob { get; set; }
        public string Password { get; set; } = string.Empty;

        // Patient-specific fields
        public string? EmergencyContact { get; set; }
        public string? Allergies { get; set; }

        // Doctor-specific fields
        public string? Specialization { get; set; }
        public string? LicenseNumber { get; set; }
        public int? YearsExperience { get; set; }
    }
}
