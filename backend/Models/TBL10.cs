using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models;

[Table("payments")]
public class TBL10
{
    [Key]
    [Column("payment_id")]
    public int L10F01 { get; set; }

    [Required]
    [Column("appointment_id")]
    public int L10F02 { get; set; }

    [Required]
    [Column("patient_user_id")]
    public int L10F03 { get; set; }

    [Required]
    [Column("doctor_user_id")]
    public int L10F04 { get; set; }

    [Required]
    [Column("amount_cents")]
    public long L10F05 { get; set; }

    [Required]
    [Column("currency")]
    [MaxLength(3)]
    public string L10F06 { get; set; } = "USD";

    [Required]
    [Column("stripe_payment_intent_id")]
    [MaxLength(255)]
    public string L10F07 { get; set; } = string.Empty;

    [Column("stripe_charge_id")]
    [MaxLength(255)]
    public string? L10F08 { get; set; }

    [Required]
    [Column("payment_status")]
    [MaxLength(50)]
    public string L10F09 { get; set; } = "PENDING";

    [Column("payment_method")]
    [MaxLength(50)]
    public string? L10F10 { get; set; }

    [Column("failure_reason")]
    public string? L10F11 { get; set; }

    [Required]
    [Column("created_at_utc")]
    public DateTime L10F12 { get; set; }

    [Required]
    [Column("updated_at_utc")]
    public DateTime L10F13 { get; set; }

    // Navigation properties
    [ForeignKey("L10F02")]
    public virtual TBL04? Appointment { get; set; }

    [ForeignKey("L10F03")]
    public virtual TBL01? Patient { get; set; }

    [ForeignKey("L10F04")]
    public virtual TBL01? Doctor { get; set; }
}
