using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("refunds")]
public class TBL11
{
    [Key]
    [Column("refund_id")]
    public int L11F01 { get; set; }

    [Required]
    [Column("payment_id")]
    public int L11F02 { get; set; }

    [Required]
    [Column("appointment_id")]
    public int L11F03 { get; set; }

    [Required]
    [Column("refund_amount_cents")]
    public long L11F04 { get; set; }

    [Required]
    [Column("stripe_refund_id")]
    [MaxLength(255)]
    public string L11F05 { get; set; } = string.Empty;

    [Required]
    [Column("refund_status")]
    [MaxLength(50)]
    public string L11F06 { get; set; } = "PENDING";

    [Required]
    [Column("refund_reason")]
    [MaxLength(255)]
    public string L11F07 { get; set; } = string.Empty;

    [Column("failure_reason")]
    public string? L11F08 { get; set; }

    [Required]
    [Column("created_at_utc")]
    public DateTime L11F09 { get; set; }

    [Required]
    [Column("updated_at_utc")]
    public DateTime L11F10 { get; set; }

    // Navigation properties
    [ForeignKey("L11F02")]
    public virtual TBL10? Payment { get; set; }

    [ForeignKey("L11F03")]
    public virtual TBL04? Appointment { get; set; }
}
