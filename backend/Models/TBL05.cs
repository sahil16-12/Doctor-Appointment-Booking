using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{
    /// <summary>
    /// Represents clinic master data table.
    /// </summary>
    [Table("clinics")]
    public class TBL05
    {
        #region Public Properties

        /// <summary>
        /// Represents clinic row identifier.
        /// </summary>
        [Key]
        [Column("id")]
        public int L05F01 { get; set; }

        /// <summary>
        /// Represents clinic name.
        /// </summary>
        [Column("name")]
        public string L05F02 { get; set; } = string.Empty;

        /// <summary>
        /// Represents clinic address line.
        /// </summary>
        [Column("address_line")]
        public string L05F03 { get; set; } = string.Empty;

        /// <summary>
        /// Represents clinic city name.
        /// </summary>
        [Column("city")]
        public string L05F04 { get; set; } = string.Empty;

        /// <summary>
        /// Represents clinic state name.
        /// </summary>
        [Column("state")]
        public string L05F05 { get; set; } = string.Empty;

        /// <summary>
        /// Represents clinic postal pincode.
        /// </summary>
        [Column("pincode")]
        public string L05F06 { get; set; } = string.Empty;

        /// <summary>
        /// Represents clinic geographic latitude coordinate.
        /// </summary>
        [Column("latitude")]
        public decimal? L05F07 { get; set; }

        /// <summary>
        /// Represents clinic geographic longitude coordinate.
        /// </summary>
        [Column("longitude")]
        public decimal? L05F08 { get; set; }

        /// <summary>
        /// Represents clinic contact phone number.
        /// </summary>
        [Column("phone")]
        public string? L05F09 { get; set; } = string.Empty;

        /// <summary>
        /// Represents clinic record creation UTC date and time.
        /// </summary>
        [Column("created_at")]
        public DateTime L05F10 { get; set; } = DateTime.UtcNow;

        #endregion
    }
}