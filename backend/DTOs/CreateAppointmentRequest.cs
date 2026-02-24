using System.ComponentModel.DataAnnotations;
using backend.Mapping;

namespace backend.DTOs
{
    /// <summary>
    /// Represents patient request for creating a new appointment.
    /// </summary>
    public class CreateAppointmentRequest
    {
        #region Public Properties

        /// <summary>
        /// Gets or sets doctor user identifier.
        /// </summary>
        [Required]
        [Range(1, int.MaxValue)]
        [MapProperty("L04F03")]
        public int DoctorUserId { get; set; }

        /// <summary>
        /// Gets or sets appointment UTC date and time.
        /// </summary>
        [Required]
        [MapProperty("L04F04")]
        public DateTime AppointmentAtUtc { get; set; }

        /// <summary>
        /// Gets or sets reason for booking.
        /// </summary>
        [Required]
        [MinLength(5)]
        [MaxLength(500)]
        [MapProperty("L04F05")]
        public string Reason { get; set; } = string.Empty;

        #endregion
    }
}
