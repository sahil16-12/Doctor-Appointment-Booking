using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    /// <summary>
    /// Represents doctor action request for pending appointment.
    /// </summary>
    public class AppointmentDecisionRequest
    {
        #region Public Properties

        /// <summary>
        /// Gets or sets decision action.
        /// </summary>
        [Required]
        [EnumDataType(typeof(AppointmentDecisionAction))]
        public AppointmentDecisionAction Decision { get; set; }

        /// <summary>
        /// Gets or sets optional doctor note.
        /// </summary>
        [MaxLength(500)]
        public string? DoctorNotes { get; set; }

        #endregion
    }

    /// <summary>
    /// Represents doctor decision types for pending appointment.
    /// </summary>
    public enum AppointmentDecisionAction
    {
        /// <summary>
        /// Represents approve action.
        /// </summary>
        APPROVE,

        /// <summary>
        /// Represents decline action.
        /// </summary>
        DECLINE
    }
}
