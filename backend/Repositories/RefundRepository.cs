using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class RefundRepository : IRefundRepository
{
    private readonly ApplicationDbContext _context;

    public RefundRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TBL11?> GetByIdAsync(int refundId)
    {
        return await _context.Refunds
            .Include(r => r.Payment)
            .Include(r => r.Appointment)
            .FirstOrDefaultAsync(r => r.L11F01 == refundId);
    }

    public async Task<TBL11?> GetByPaymentIdAsync(int paymentId)
    {
        return await _context.Refunds
            .FirstOrDefaultAsync(r => r.L11F02 == paymentId);
    }

    public async Task<List<TBL11>> GetByAppointmentIdAsync(int appointmentId)
    {
        return await _context.Refunds
            .Include(r => r.Payment)
            .Where(r => r.L11F03 == appointmentId)
            .OrderByDescending(r => r.L11F09)
            .ToListAsync();
    }

    public async Task<TBL11> CreateAsync(TBL11 refund)
    {
        refund.L11F09 = DateTime.UtcNow;
        refund.L11F10 = DateTime.UtcNow;
        
        _context.Refunds.Add(refund);
        await _context.SaveChangesAsync();
        return refund;
    }

    public async Task<TBL11> UpdateAsync(TBL11 refund)
    {
        refund.L11F10 = DateTime.UtcNow;
        
        _context.Refunds.Update(refund);
        await _context.SaveChangesAsync();
        return refund;
    }
}
