using backend.Models;

namespace backend.DTOs
{
    public class PatientProfile
    {
        public int Id { get; set; }
        public UserType UserType { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public DateTime Dob { get; set; }
        public DateTime CreatedAt { get; set; }
        public string? EmergencyContact { get; set; }
        public string? Allergies { get; set; }
    }
}
