using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    /// <summary>
    /// Represents appointment booking data table.
    /// </summary>
    [Table("appointments")]
    public class TBL04
    {
        #region Public Properties

        /// <summary>
        /// Represents appointment identifier.
        /// </summary>
        [Key]
        [Column("id")]
        public int L04F01 { get; set; }

        /// <summary>
        /// Represents patient user identifier.
        /// </summary>
        [Column("patient_user_id")]
        public int L04F02 { get; set; }

        /// <summary>
        /// Represents doctor user identifier.
        /// </summary>
        [Column("doctor_user_id")]
        public int L04F03 { get; set; }

        /// <summary>
        /// Represents scheduled appointment UTC date and time.
        /// </summary>
        [Column("appointment_at_utc")]
        public DateTime L04F04 { get; set; }

        /// <summary>
        /// Represents appointment reason provided by patient.
        /// </summary>
        [Column("reason")]
        public string L04F05 { get; set; } = string.Empty;

        /// <summary>
        /// Represents appointment status.
        /// </summary>
        [Column("status")]
        public AppointmentStatus L04F06 { get; set; } = AppointmentStatus.PENDING;

        /// <summary>
        /// Represents doctor action notes.
        /// </summary>
        [Column("doctor_notes")]
        public string? L04F07 { get; set; }

        /// <summary>
        /// Represents appointment creation UTC date and time.
        /// </summary>
        [Column("created_at")]
        public DateTime L04F08 { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Represents appointment last update UTC date and time.
        /// </summary>
        [Column("updated_at")]
        public DateTime L04F09 { get; set; } = DateTime.UtcNow;

        #endregion
    }
}
