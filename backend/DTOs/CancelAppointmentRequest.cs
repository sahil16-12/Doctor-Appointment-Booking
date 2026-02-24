using System.ComponentModel.DataAnnotations;
using backend.Mapping;

namespace backend.DTOs
{
    /// <summary>
    /// Represents doctor request for cancelling a future appointment.
    /// </summary>
    public class CancelAppointmentRequest
    {
        #region Public Properties

        /// <summary>
        /// Gets or sets cancellation note.
        /// </summary>
        [Required]
        [MinLength(3)]
        [MaxLength(500)]
        [MapProperty("L04F07")]
        public string DoctorNotes { get; set; } = string.Empty;

        #endregion
    }
}
