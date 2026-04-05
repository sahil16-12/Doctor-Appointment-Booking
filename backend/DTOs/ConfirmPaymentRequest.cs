using System.ComponentModel.DataAnnotations;

namespace backend.DTOs;

public class ConfirmPaymentRequest
{
    [Required]
    public string PaymentIntentId { get; set; } = string.Empty;

    [Required]
    public int DoctorUserId { get; set; }

    [Required]
    public int SlotId { get; set; }

    [Required]
    [StringLength(500, MinimumLength = 5)]
    public string Reason { get; set; } = string.Empty;
}
