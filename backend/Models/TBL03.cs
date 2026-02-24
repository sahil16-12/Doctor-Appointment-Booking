using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    /// <summary>
    /// Represents doctor detail data table.
    /// </summary>
    [Table("doctors")]
    public class TBL03
    {
        #region Public Properties

        /// <summary>
        /// Represents doctor row identifier.
        /// </summary>
        [Key]
        [Column("id")]
        public int L03F01 { get; set; }

        /// <summary>
        /// Represents related user identifier.
        /// </summary>
        [Column("user_id")]
        public int L03F02 { get; set; }

        /// <summary>
        /// Represents doctor specialization.
        /// </summary>
        [Column("specialization")]
        public string? L03F03 { get; set; }

        /// <summary>
        /// Represents doctor license number.
        /// </summary>
        [Column("license_number")]
        public string? L03F04 { get; set; }

        /// <summary>
        /// Represents years of doctor experience.
        /// </summary>
        [Column("years_experience")]
        public int? L03F05 { get; set; }

        /// <summary>
        /// Represents doctor record creation UTC date and time.
        /// </summary>
        [Column("created_at")]
        public DateTime L03F06 { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Represents related user master data.
        /// </summary>
        [ForeignKey("L03F02")]
        public TBL01 L03F07 { get; set; } = null!;

        #endregion
    }
}
