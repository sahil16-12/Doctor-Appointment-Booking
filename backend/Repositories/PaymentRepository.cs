using backend.Data;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repositories;

public class PaymentRepository : IPaymentRepository
{
    private readonly ApplicationDbContext _context;

    public PaymentRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<TBL10?> GetByIdAsync(int paymentId)
    {
        return await _context.Payments
            .Include(p => p.Appointment)
            .Include(p => p.Patient)
            .Include(p => p.Doctor)
            .FirstOrDefaultAsync(p => p.L10F01 == paymentId);
    }

    public async Task<TBL10?> GetByAppointmentIdAsync(int appointmentId)
    {
        return await _context.Payments
            .Include(p => p.Appointment)
            .FirstOrDefaultAsync(p => p.L10F02 == appointmentId);
    }

    public async Task<TBL10?> GetByPaymentIntentIdAsync(string paymentIntentId)
    {
        return await _context.Payments
            .FirstOrDefaultAsync(p => p.L10F07 == paymentIntentId);
    }

    public async Task<List<TBL10>> GetByPatientIdAsync(int patientUserId)
    {
        return await _context.Payments
            .Include(p => p.Appointment)
            .Include(p => p.Doctor)
            .Where(p => p.L10F03 == patientUserId)
            .OrderByDescending(p => p.L10F12)
            .ToListAsync();
    }

    public async Task<List<TBL10>> GetByDoctorIdAsync(int doctorUserId)
    {
        return await _context.Payments
            .Include(p => p.Appointment)
            .Include(p => p.Patient)
            .Where(p => p.L10F04 == doctorUserId)
            .OrderByDescending(p => p.L10F12)
            .ToListAsync();
    }

    public async Task<TBL10> CreateAsync(TBL10 payment)
    {
        payment.L10F12 = DateTime.UtcNow;
        payment.L10F13 = DateTime.UtcNow;
        
        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();
        return payment;
    }

    public async Task<TBL10> UpdateAsync(TBL10 payment)
    {
        payment.L10F13 = DateTime.UtcNow;
        
        _context.Payments.Update(payment);
        await _context.SaveChangesAsync();
        return payment;
    }
}
