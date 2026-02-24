using backend.DTOs;
using backend.Mapping;
using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    /// <summary>
    /// Provides business logic for appointment booking operations.
    /// </summary>
    public class AppointmentService : IAppointmentService
    {
        #region Private Fields

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
        /// Initializes a new instance of the <see cref="AppointmentService"/> class.
        /// </summary>
        /// <param name="appointmentRepository">The appointment repository.</param>
        /// <param name="reflectionMapper">The reflection mapper.</param>
        public AppointmentService(IAppointmentRepository appointmentRepository, IReflectionMapper reflectionMapper)
        {
            _appointmentRepository = appointmentRepository;
            _reflectionMapper = reflectionMapper;
        }

        #endregion

        #region Public Methods

        /// <inheritdoc/>
        public async Task<(List<AvailableDoctorResponse>? response, ErrorResponse? error)> GetAvailableDoctorsAsync(int patientUserId)
        {
            TBL01? patient = await _appointmentRepository.FindUserByIdAsync(patientUserId);
            if (patient == null || patient.L01F02 != UserType.PATIENT)
            {
                return (null, new ErrorResponse { Message = "Patient profile not found." });
            }

            List<TBL03> doctors = await _appointmentRepository.GetAllDoctorsAsync();
            List<AvailableDoctorResponse> doctorResponses = new List<AvailableDoctorResponse>();

            foreach (TBL03 doctor in doctors)
            {
                if (doctor.L03F07 == null || doctor.L03F07.L01F02 != UserType.DOCTOR)
                {
                    continue;
                }

                AvailableDoctorResponse response = _reflectionMapper.Map<TBL01, AvailableDoctorResponse>(doctor.L03F07);
                _reflectionMapper.MapToExisting<TBL03, AvailableDoctorResponse>(doctor, response);
                doctorResponses.Add(response);
            }

            return (doctorResponses, null);
        }

        /// <inheritdoc/>
        public async Task<(AppointmentResponse? response, ErrorResponse? error)> CreateAppointmentAsync(int patientUserId, CreateAppointmentRequest request)
        {
            TBL01? patient = await _appointmentRepository.FindUserByIdAsync(patientUserId);
            if (patient == null || patient.L01F02 != UserType.PATIENT)
            {
                return (null, new ErrorResponse { Message = "Patient profile not found." });
            }

            bool doctorExists = await _appointmentRepository.DoesDoctorExistAsync(request.DoctorUserId);
            if (!doctorExists)
            {
                return (null, new ErrorResponse { Message = "Doctor not found." });
            }

            DateTime normalizedAppointmentUtc = DateTime.SpecifyKind(request.AppointmentAtUtc, DateTimeKind.Utc);
            if (normalizedAppointmentUtc <= DateTime.UtcNow)
            {
                return (null, new ErrorResponse { Message = "Appointment time must be in the future." });
            }

            bool isDoctorSlotOccupied = await _appointmentRepository
                .IsDoctorSlotOccupiedAsync(request.DoctorUserId, normalizedAppointmentUtc);
            if (isDoctorSlotOccupied)
            {
                return (null, new ErrorResponse { Message = "Selected doctor slot is not available." });
            }

            bool hasDuplicateAppointment = await _appointmentRepository
                .IsPatientDuplicateAppointmentAsync(patientUserId, request.DoctorUserId, normalizedAppointmentUtc);
            if (hasDuplicateAppointment)
            {
                return (null, new ErrorResponse { Message = "Duplicate appointment request already exists." });
            }

            TBL04 appointment = _reflectionMapper.Map<CreateAppointmentRequest, TBL04>(request);
            appointment.L04F02 = patientUserId;
            appointment.L04F04 = normalizedAppointmentUtc;
            appointment.L04F06 = AppointmentStatus.PENDING;
            appointment.L04F08 = DateTime.UtcNow;
            appointment.L04F09 = DateTime.UtcNow;

            await _appointmentRepository.CreateAppointmentAsync(appointment);

            AppointmentResponse response = _reflectionMapper.Map<TBL04, AppointmentResponse>(appointment);
            return (response, null);
        }

        /// <inheritdoc/>
        public async Task<(List<AppointmentResponse>? response, ErrorResponse? error)> GetPendingAppointmentsAsync(int doctorUserId)
        {
            bool doctorExists = await _appointmentRepository.DoesDoctorExistAsync(doctorUserId);
            if (!doctorExists)
            {
                return (null, new ErrorResponse { Message = "Doctor profile not found." });
            }

            List<TBL04> appointments = await _appointmentRepository
                .GetDoctorAppointmentsByStatusAsync(doctorUserId, AppointmentStatus.PENDING);

            List<AppointmentResponse> responses = appointments
                .Select(appointment => _reflectionMapper.Map<TBL04, AppointmentResponse>(appointment))
                .ToList();

            return (responses, null);
        }

        /// <inheritdoc/>
        public async Task<ErrorResponse?> DecideAppointmentAsync(int doctorUserId, int appointmentId, AppointmentDecisionRequest request)
        {
            bool doctorExists = await _appointmentRepository.DoesDoctorExistAsync(doctorUserId);
            if (!doctorExists)
            {
                return new ErrorResponse { Message = "Doctor profile not found." };
            }

            TBL04? appointment = await _appointmentRepository.FindAppointmentByIdAsync(appointmentId);
            if (appointment == null)
            {
                return new ErrorResponse { Message = "Appointment not found." };
            }

            if (appointment.L04F03 != doctorUserId)
            {
                return new ErrorResponse { Message = "You are not authorized to modify this appointment." };
            }

            if (appointment.L04F06 != AppointmentStatus.PENDING)
            {
                return new ErrorResponse { Message = "Only pending appointments can be approved or declined." };
            }

            appointment.L04F06 = request.Decision == AppointmentDecisionAction.APPROVE
                ? AppointmentStatus.APPROVED
                : AppointmentStatus.DECLINED;
            appointment.L04F07 = request.DoctorNotes;
            appointment.L04F09 = DateTime.UtcNow;

            await _appointmentRepository.UpdateAppointmentAsync(appointment);
            return null;
        }

        /// <inheritdoc/>
        public async Task<ErrorResponse?> CancelFutureAppointmentAsync(int doctorUserId, int appointmentId, CancelAppointmentRequest request)
        {
            bool doctorExists = await _appointmentRepository.DoesDoctorExistAsync(doctorUserId);
            if (!doctorExists)
            {
                return new ErrorResponse { Message = "Doctor profile not found." };
            }

            TBL04? appointment = await _appointmentRepository.FindAppointmentByIdAsync(appointmentId);
            if (appointment == null)
            {
                return new ErrorResponse { Message = "Appointment not found." };
            }

            if (appointment.L04F03 != doctorUserId)
            {
                return new ErrorResponse { Message = "You are not authorized to modify this appointment." };
            }

            if (appointment.L04F04 <= DateTime.UtcNow)
            {
                return new ErrorResponse { Message = "Only future appointments can be cancelled." };
            }

            if (appointment.L04F06 != AppointmentStatus.PENDING && appointment.L04F06 != AppointmentStatus.APPROVED)
            {
                return new ErrorResponse { Message = "Only pending or approved appointments can be cancelled." };
            }

            _reflectionMapper.MapToExisting<CancelAppointmentRequest, TBL04>(request, appointment);
            appointment.L04F06 = AppointmentStatus.CANCELLED;
            appointment.L04F09 = DateTime.UtcNow;

            await _appointmentRepository.UpdateAppointmentAsync(appointment);
            return null;
        }

        #endregion
    }
}
