using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    /// <summary>
    /// Represents patient detail data table.
    /// </summary>
    [Table("patients")]
    public class TBL02
    {
        #region Public Properties

        /// <summary>
        /// Represents patient row identifier.
        /// </summary>
        [Key]
        [Column("id")]
        public int L02F01 { get; set; }

        /// <summary>
        /// Represents related user identifier.
        /// </summary>
        [Column("user_id")]
        public int L02F02 { get; set; }

        /// <summary>
        /// Represents emergency contact number.
        /// </summary>
        [Column("emergency_contact")]
        public string? L02F03 { get; set; }

        /// <summary>
        /// Represents patient allergy notes.
        /// </summary>
        [Column("allergies")]
        public string? L02F04 { get; set; }

        /// <summary>
        /// Represents patient record creation UTC date and time.
        /// </summary>
        [Column("created_at")]
        public DateTime L02F05 { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Represents related user master data.
        /// </summary>
        [ForeignKey("L02F02")]
        public TBL01 L02F06 { get; set; } = null!;

        #endregion
    }
}
