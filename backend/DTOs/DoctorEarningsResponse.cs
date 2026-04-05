namespace backend.DTOs;

public class DoctorEarningsResponse
{
    public decimal TotalEarnings { get; set; }
    public decimal ThisMonthEarnings { get; set; }
    public decimal PendingPayouts { get; set; }
    public int TotalCompletedAppointments { get; set; }
    public int ThisMonthCompletedAppointments { get; set; }
    public List<TransactionItem> RecentTransactions { get; set; } = new();
}

public class TransactionItem
{
    public int PaymentId { get; set; }
    public int AppointmentId { get; set; }
    public string PatientName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime PaymentDate { get; set; }
    public bool IsRefunded { get; set; }
    public string? RefundReason { get; set; }
    public DateTime? RefundDate { get; set; }
}
