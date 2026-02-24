using System.ComponentModel.DataAnnotations;
using backend.Mapping;
using backend.Models;

namespace backend.DTOs
{
    /// <summary>
    /// Represents signup request payload.
    /// </summary>
    public class SignupRequest : IValidatableObject
    {
        #region Public Properties

        /// <summary>
        /// Gets or sets the requested user role type.
        /// </summary>
        [Required]
        [EnumDataType(typeof(UserType))]
        [MapProperty("L01F02")]
        public UserType UserType { get; set; }

        /// <summary>
        /// Gets or sets full name.
        /// </summary>
        [Required]
        [MinLength(3)]
        [MaxLength(100)]
        [RegularExpression(@"^[a-zA-Z ]+$")]
        [MapProperty("L01F03")]
        public string FullName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets email address.
        /// </summary>
        [Required]
        [EmailAddress]
        [MaxLength(100)]
        [MapProperty("L01F04")]
        public string Email { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets phone number.
        /// </summary>
        [Required]
        [RegularExpression(@"^[0-9]{10}$")]
        [MapProperty("L01F05")]
        public string Phone { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets date of birth.
        /// </summary>
        [Required]
        [MapProperty("L01F06")]
        public DateTime Dob { get; set; }

        /// <summary>
        /// Gets or sets password text.
        /// </summary>
        [Required]
        [MinLength(6)]
        public string Password { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets patient emergency contact number.
        /// </summary>
        [RegularExpression(@"^$|^[0-9]{10}$")]
        [MapProperty("L02F03")]
        public string? EmergencyContact { get; set; }

        /// <summary>
        /// Gets or sets patient allergy notes.
        /// </summary>
        [MinLength(3)]
        [MapProperty("L02F04")]
        public string? Allergies { get; set; }

        /// <summary>
        /// Gets or sets doctor specialization.
        /// </summary>
        [MapProperty("L03F03")]
        public string? Specialization { get; set; }

        /// <summary>
        /// Gets or sets doctor license number.
        /// </summary>
        [MapProperty("L03F04")]
        public string? LicenseNumber { get; set; }

        /// <summary>
        /// Gets or sets doctor years of experience.
        /// </summary>
        [Range(0, 60)]
        [MapProperty("L03F05")]
        public int? YearsExperience { get; set; }

        #endregion

        #region Public Methods

        /// <summary>
        /// Performs cross-property and role-based validation.
        /// </summary>
        /// <param name="validationContext">The validation context.</param>
        /// <returns>Validation errors for invalid fields.</returns>
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (UserType == UserType.DOCTOR)
            {
                if (string.IsNullOrWhiteSpace(Specialization))
                {
                    yield return new ValidationResult(
                        "Specialization is required for doctors.",
                        new[] { nameof(Specialization) });
                }

                if (string.IsNullOrWhiteSpace(LicenseNumber))
                {
                    yield return new ValidationResult(
                        "License number is required for doctors.",
                        new[] { nameof(LicenseNumber) });
                }

                if (!YearsExperience.HasValue)
                {
                    yield return new ValidationResult(
                        "Years of experience is required for doctors.",
                        new[] { nameof(YearsExperience) });
                }
            }
            else if (UserType == UserType.PATIENT)
            {
                Specialization = null;
                LicenseNumber = null;
                YearsExperience = null;
            }
        }

        #endregion
    }
}
