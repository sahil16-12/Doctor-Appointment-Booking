using System.Text.Json.Serialization;
using backend.Mapping;

namespace backend.DTOs
{
    /// <summary>
    /// Represents patient profile response data.
    /// </summary>
    public class PatientProfileResponse
    {
        #region Public Properties

        /// <summary>
        /// Gets or sets patient identifier.
        /// </summary>
        [MapProperty("L02F01")]
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets related user identifier.
        /// </summary>
        [MapProperty("L02F02")]
        public int UserId { get; set; }

        /// <summary>
        /// Gets or sets full name.
        /// </summary>
        [MapProperty("L01F03")]
        public string FullName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets email address.
        /// </summary>
        [MapProperty("L01F04")]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets phone number.
        /// </summary>
        [MapProperty("L01F05")]
        public string Phone { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets date of birth.
        /// </summary>
        [MapProperty("L01F06")]
        public DateTime Dob { get; set; }

        /// <summary>
        /// Gets or sets emergency contact number.
        /// </summary>
        [MapProperty("L02F03")]
        public string? EmergencyContact { get; set; }

        /// <summary>
        /// Gets or sets patient allergy notes.
        /// </summary>
        [MapProperty("L02F04")]
        public string? Allergies { get; set; }

        /// <summary>
        /// Gets or sets patient blood group.
        /// </summary>
        [MapProperty("L02F07")]
        public string? BloodGroup { get; set; }

        /// <summary>
        /// Gets or sets patient height in centimeters.
        /// </summary>
        [MapProperty("L02F08")]
        public int? HeightCm { get; set; }

        /// <summary>
        /// Gets or sets patient weight in kilograms.
        /// </summary>
        [MapProperty("L02F09")]
        public int? WeightKg { get; set; }

        /// <summary>
        /// Gets or sets patient chronic conditions.
        /// </summary>
        [MapProperty("L02F10")]
        public string? ChronicConditions { get; set; }

        /// <summary>
        /// Gets or sets patient latitude coordinate for location-based doctor search.
        /// </summary>
        [MapProperty("L02F11")]
        public decimal? Latitude { get; set; }

        /// <summary>
        /// Gets or sets patient longitude coordinate for location-based doctor search.
        /// </summary>
        [MapProperty("L02F12")]
        public decimal? Longitude { get; set; }

        /// <summary>
        /// Gets or sets patient city.
        /// </summary>
        [JsonPropertyName("city")]
        [MapProperty("L02F13")]
        public string? City { get; set; }

        /// <summary>
        /// Gets or sets patient state/province.
        /// </summary>
        [JsonPropertyName("state")]
        [MapProperty("L02F14")]
        public string? State { get; set; }

        /// <summary>
        /// Gets or sets the number of appointments with the doctor (not mapped from model, populated by service).
        /// </summary>
        public int AppointmentCount { get; set; }

        /// <summary>
        /// Gets or sets the date of the last appointment with the doctor (not mapped from model, populated by service).
        /// </summary>
        public DateTime? LastAppointmentDate { get; set; }

        #endregion
    }
}
