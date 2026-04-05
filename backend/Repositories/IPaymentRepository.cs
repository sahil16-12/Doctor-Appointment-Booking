using backend.Models;

namespace backend.Repositories;

public interface IPaymentRepository
{
    Task<TBL10?> GetByIdAsync(int paymentId);
    Task<TBL10?> GetByAppointmentIdAsync(int appointmentId);
    Task<TBL10?> GetByPaymentIntentIdAsync(string paymentIntentId);
    Task<List<TBL10>> GetByPatientIdAsync(int patientUserId);
    Task<List<TBL10>> GetByDoctorIdAsync(int doctorUserId);
    Task<TBL10> CreateAsync(TBL10 payment);
    Task<TBL10> UpdateAsync(TBL10 payment);
}
