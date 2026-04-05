using backend.Models;

namespace backend.Repositories;

public interface IRefundRepository
{
    Task<TBL11?> GetByIdAsync(int refundId);
    Task<TBL11?> GetByPaymentIdAsync(int paymentId);
    Task<List<TBL11>> GetByAppointmentIdAsync(int appointmentId);
    Task<TBL11> CreateAsync(TBL11 refund);
    Task<TBL11> UpdateAsync(TBL11 refund);
}
