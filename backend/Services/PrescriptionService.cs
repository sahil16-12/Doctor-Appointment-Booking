using backend.DTOs;
using backend.Exceptions;
using backend.Mapping;
using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    /// <summary>
    /// Provides business logic for prescription operations.
    /// </summary>
    public class PrescriptionService : IPrescriptionService
    {
        #region Private Fields

        /// <summary>
        /// Represents prescription repository dependency.
        /// </summary>
        private readonly IPrescriptionRepository _prescriptionRepository;

        /// <summary>
        /// Represents appointment repository dependency.
        /// </summary>
        private readonly IAppointmentRepository _appointmentRepository;

        /// <summary>
        /// Represents reflection mapper dependency.
        /// </summary>
        private readonly IReflectionMapper _reflectionMapper;

        #endregion

        #region Constructor

        /// <summary>
        /// Initializes a new instance of the <see cref="PrescriptionService"/> class.
        /// </summary>
        /// <param name="prescriptionRepository">The prescription repository.</param>
        /// <param name="appointmentRepository">The appointment repository.</param>
        /// <param name="reflectionMapper">The reflection mapper.</param>
        public PrescriptionService(
            IPrescriptionRepository prescriptionRepository,
            IAppointmentRepository appointmentRepository,
            IReflectionMapper reflectionMapper)
        {
            _prescriptionRepository = prescriptionRepository;
            _appointmentRepository = appointmentRepository;
            _reflectionMapper = reflectionMapper;
        }

        #endregion

        #region Public Methods

        /// <inheritdoc/>
        public async Task<PrescriptionResponse> CreatePrescriptionAsync(
            int doctorUserId,
            CreatePrescriptionRequest request)
        {
            try
            {
                // Validate doctor owns the appointment
                TBL04? appointment = await _appointmentRepository.FindAppointmentByIdAsync(request.AppointmentId);
                if (appointment == null)
                {
                    throw new AppException(
                        "Appointment not found.",
                        StatusCodes.Status404NotFound);
                }

                if (appointment.L04F03 != doctorUserId)
                {
                    throw new AppException(
                        "Doctor does not have permission to issue prescription for this appointment.",
                        StatusCodes.Status403Forbidden);
                }

                // Map request to model
                TBL08 prescription = _reflectionMapper.Map<CreatePrescriptionRequest, TBL08>(request);
                prescription.L08F03 = doctorUserId;
                prescription.L08F04 = appointment.L04F02;

                // Create prescription
                await _prescriptionRepository.CreatePrescriptionAsync(prescription);

                // Map and return response
                return await MapPrescriptionResponseAsync(prescription);
            }
            catch (AppException)
            {
                // Re-throw AppException to be handled by middleware
                throw;
            }
            catch (Exception ex)
            {
                // Convert unexpected exceptions to AppException
                throw new AppException(
                    $"Failed to create prescription: {ex.Message}",
                    StatusCodes.Status500InternalServerError);
            }
        }

        /// <inheritdoc/>
        public async Task<List<PrescriptionResponse>> GetPatientPrescriptionsAsync(int patientUserId)
        {
            List<TBL08> prescriptions = await _prescriptionRepository.GetPatientPrescriptionsAsync(patientUserId);
            List<PrescriptionResponse> responses = new List<PrescriptionResponse>();

            foreach (TBL08 prescription in prescriptions)
            {
                responses.Add(await MapPrescriptionResponseAsync(prescription));
            }

            return responses;
        }

        /// <inheritdoc/>
        public async Task<List<PrescriptionResponse>> GetDoctorIssuedPrescriptionsAsync(int doctorUserId)
        {
            List<TBL08> prescriptions = await _prescriptionRepository.GetDoctorIssuedPrescriptionsAsync(doctorUserId);
            List<PrescriptionResponse> responses = new List<PrescriptionResponse>();

            foreach (TBL08 prescription in prescriptions)
            {
                responses.Add(await MapPrescriptionResponseAsync(prescription));
            }

            return responses;
        }

        /// <inheritdoc/>
        public async Task<PrescriptionResponse?> GetPrescriptionByIdAsync(int prescriptionId)
        {
            TBL08? prescription = await _prescriptionRepository.FindPrescriptionByIdAsync(prescriptionId);
            return prescription != null ? await MapPrescriptionResponseAsync(prescription) : null;
        }

        /// <inheritdoc/>
        public async Task UpdatePrescriptionAsync(
            int doctorUserId,
            int prescriptionId,
            CreatePrescriptionRequest request)
        {
            TBL08? prescription = await _prescriptionRepository.FindPrescriptionByIdAsync(prescriptionId);
            if (prescription == null)
            {
                throw new AppException("Prescription not found.", StatusCodes.Status404NotFound);
            }

            if (prescription.L08F03 != doctorUserId)
            {
                throw new AppException(
                    "Only the issuing doctor can update this prescription.",
                    StatusCodes.Status403Forbidden);
            }

            // Map request fields to existing prescription
            _reflectionMapper.MapToExisting<CreatePrescriptionRequest, TBL08>(request, prescription);
            await _prescriptionRepository.UpdatePrescriptionAsync(prescription);
        }

        /// <inheritdoc/>
        public async Task DeletePrescriptionAsync(int doctorUserId, int prescriptionId)
        {
            TBL08? prescription = await _prescriptionRepository.FindPrescriptionByIdAsync(prescriptionId);
            if (prescription == null)
            {
                throw new AppException("Prescription not found.", StatusCodes.Status404NotFound);
            }

            if (prescription.L08F03 != doctorUserId)
            {
                throw new AppException(
                    "Only the issuing doctor can delete this prescription.",
                    StatusCodes.Status403Forbidden);
            }

            await _prescriptionRepository.DeletePrescriptionAsync(prescriptionId);
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// Maps a prescription model to a response DTO and enriches with related data.
        /// </summary>
        /// <param name="prescription">The prescription model to map.</param>
        /// <returns>The mapped prescription response.</returns>
        private async Task<PrescriptionResponse> MapPrescriptionResponseAsync(TBL08 prescription)
        {
            try
            {
                PrescriptionResponse response = _reflectionMapper.Map<TBL08, PrescriptionResponse>(prescription);

                // Enrich with appointment data
                if (prescription.L08F02 > 0)
                {
                    TBL04? appointment = await _appointmentRepository.FindAppointmentByIdAsync(prescription.L08F02);
                    if (appointment != null)
                    {
                        response.AppointmentDate = appointment.L04F04;
                    }
                }

                // Enrich with doctor name
                if (prescription.L08F03 > 0)
                {
                    TBL01? doctor = await _appointmentRepository.FindUserByIdAsync(prescription.L08F03);
                    if (doctor != null)
                    {
                        response.DoctorName = doctor.L01F03;
                    }
                }

                // Enrich with patient name
                if (prescription.L08F04 > 0)
                {
                    TBL01? patient = await _appointmentRepository.FindUserByIdAsync(prescription.L08F04);
                    if (patient != null)
                    {
                        response.PatientName = patient.L01F03;
                    }
                }

                return response;
            }
            catch (Exception ex)
            {
                throw new AppException(
                    $"Failed to map prescription response: {ex.Message}",
                    StatusCodes.Status500InternalServerError);
            }
        }

        #endregion
    }
}
