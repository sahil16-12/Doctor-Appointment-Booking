namespace backend.DTOs;

public class PaymentResponse
{
    public int PaymentId { get; set; }
    public int AppointmentId { get; set; }
    public long AmountCents { get; set; }
    public decimal AmountDecimal => AmountCents / 100.0m;
    public string Currency { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string StripePaymentIntentId { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
}
