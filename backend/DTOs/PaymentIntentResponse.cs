namespace backend.DTOs;

public class PaymentIntentResponse
{
    public string ClientSecret { get; set; } = string.Empty;
    public string PaymentIntentId { get; set; } = string.Empty;
    public long AmountCents { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string DoctorName { get; set; } = string.Empty;
    public decimal ConsultationFee { get; set; }
}
