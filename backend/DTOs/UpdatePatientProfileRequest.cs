using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using backend.Mapping;

namespace backend.DTOs
{
    /// <summary>
    /// Represents patient profile update request payload.
    /// </summary>
    public class UpdatePatientProfileRequest
    {
        #region Public Properties

        /// <summary>
        /// Gets or sets emergency contact number.
        /// </summary>
        [MaxLength(20, ErrorMessage = "Emergency contact cannot exceed 20 characters.")]
        [MapProperty("L02F03")]
        public string? EmergencyContact { get; set; }

        /// <summary>
        /// Gets or sets patient allergy notes.
        /// </summary>
        [MaxLength(500, ErrorMessage = "Allergies cannot exceed 500 characters.")]
        [MapProperty("L02F04")]
        public string? Allergies { get; set; }

        /// <summary>
        /// Gets or sets patient blood group.
        /// </summary>
        [MaxLength(10, ErrorMessage = "Blood group cannot exceed 10 characters.")]
        [MapProperty("L02F07")]
        public string? BloodGroup { get; set; }

        /// <summary>
        /// Gets or sets patient height in centimeters.
        /// </summary>
        [Range(0, 300, ErrorMessage = "Height must be between 0 and 300 cm.")]
        [MapProperty("L02F08")]
        public int? HeightCm { get; set; }

        /// <summary>
        /// Gets or sets patient weight in kilograms.
        /// </summary>
        [Range(0, 500, ErrorMessage = "Weight must be between 0 and 500 kg.")]
        [MapProperty("L02F09")]
        public int? WeightKg { get; set; }

        /// <summary>
        /// Gets or sets patient chronic conditions.
        /// </summary>
        [MaxLength(1000, ErrorMessage = "Chronic conditions cannot exceed 1000 characters.")]
        [MapProperty("L02F10")]
        public string? ChronicConditions { get; set; }

        /// <summary>
        /// Gets or sets patient latitude coordinate for location-based doctor search.
        /// </summary>
        [Range(-90, 90, ErrorMessage = "Latitude must be between -90 and 90.")]
        [MapProperty("L02F11")]
        public decimal? Latitude { get; set; }

        /// <summary>
        /// Gets or sets patient longitude coordinate for location-based doctor search.
        /// </summary>
        [Range(-180, 180, ErrorMessage = "Longitude must be between -180 and 180.")]
        [MapProperty("L02F12")]
        public decimal? Longitude { get; set; }

        /// <summary>
        /// Gets or sets patient city.
        /// </summary>
        [JsonPropertyName("city")]
        [MaxLength(100, ErrorMessage = "City cannot exceed 100 characters.")]
        [MapProperty("L02F13")]
        public string? City { get; set; }

        /// <summary>
        /// Gets or sets patient state/province.
        /// </summary>
        [JsonPropertyName("state")]
        [MaxLength(100, ErrorMessage = "State cannot exceed 100 characters.")]
        [MapProperty("L02F14")]
        public string? State { get; set; }

        #endregion
    }
}
