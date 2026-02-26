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

        /// <summary>
        /// Represents in-memory workflow state for appointment creation.
        /// </summary>
        private AppointmentCreateWorkflowState? _createAppointmentState;

        /// <summary>
        /// Represents in-memory workflow state for appointment decision.
        /// </summary>
        private AppointmentDecisionWorkflowState? _decideAppointmentState;

        /// <summary>
        /// Represents in-memory workflow state for appointment cancellation.
        /// </summary>
        private AppointmentCancelWorkflowState? _cancelAppointmentState;

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
        public Task<(TBL04? appointment, ErrorResponse? error)> CreateAppointmentPresaveAsync(int patientUserId, CreateAppointmentRequest request)
        {
            try
            {
                TBL04 appointment = _reflectionMapper.Map<CreateAppointmentRequest, TBL04>(request);
                DateTime normalizedAppointmentUtc = DateTime.SpecifyKind(request.AppointmentAtUtc, DateTimeKind.Utc);

                appointment.L04F02 = patientUserId;
                appointment.L04F04 = normalizedAppointmentUtc;
                appointment.L04F06 = AppointmentStatus.PENDING;
                appointment.L04F08 = DateTime.UtcNow;
                appointment.L04F09 = DateTime.UtcNow;

                _createAppointmentState = new AppointmentCreateWorkflowState
                {
                    PatientUserId = patientUserId,
                    Request = request,
                    Appointment = appointment
                };

                return Task.FromResult<(TBL04? appointment, ErrorResponse? error)>((appointment, null));
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Create appointment pre-save error: {ex.Message}");
                return Task.FromResult<(TBL04? appointment, ErrorResponse? error)>((null, new ErrorResponse
                {
                    Message = "Server error."
                }));
            }
        }

        /// <inheritdoc/>
        public async Task<ErrorResponse?> CreateAppointmentValidateAsync()
        {
            if (_createAppointmentState == null)
            {
                return new ErrorResponse { Message = "Invalid appointment workflow state." };
            }

            TBL01? patient = await _appointmentRepository.FindUserByIdAsync(_createAppointmentState.PatientUserId);
            if (patient == null || patient.L01F02 != UserType.PATIENT)
            {
                return new ErrorResponse { Message = "Patient profile not found." };
            }

            bool doctorExists = await _appointmentRepository.DoesDoctorExistAsync(_createAppointmentState.Request.DoctorUserId);
            if (!doctorExists)
            {
                return new ErrorResponse { Message = "Doctor not found." };
            }

            DateTime normalizedAppointmentUtc = _createAppointmentState.Appointment.L04F04;
            if (normalizedAppointmentUtc <= DateTime.UtcNow)
            {
                return new ErrorResponse { Message = "Appointment time must be in the future." };
            }

            bool isDoctorSlotOccupied = await _appointmentRepository
                .IsDoctorSlotOccupiedAsync(_createAppointmentState.Request.DoctorUserId, normalizedAppointmentUtc);
            if (isDoctorSlotOccupied)
            {
                return new ErrorResponse { Message = "Selected doctor slot is not available." };
            }

            bool hasDuplicateAppointment = await _appointmentRepository
                .IsPatientDuplicateAppointmentAsync(
                    _createAppointmentState.PatientUserId,
                    _createAppointmentState.Request.DoctorUserId,
                    normalizedAppointmentUtc);
            if (hasDuplicateAppointment)
            {
                return new ErrorResponse { Message = "Duplicate appointment request already exists." };
            }

            return null;
        }

        /// <inheritdoc/>
        public async Task<(AppointmentResponse? response, ErrorResponse? error)> CreateAppointmentSaveAsync()
        {
            try
            {
                if (_createAppointmentState == null)
                {
                    return (null, new ErrorResponse { Message = "Invalid appointment workflow state." });
                }

                _createAppointmentState.Appointment.L04F08 = DateTime.UtcNow;
                _createAppointmentState.Appointment.L04F09 = DateTime.UtcNow;

                await _appointmentRepository.CreateAppointmentAsync(_createAppointmentState.Appointment);

                AppointmentResponse response = _reflectionMapper.Map<TBL04, AppointmentResponse>(_createAppointmentState.Appointment);
                _createAppointmentState = null;

                return (response, null);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Create appointment save error: {ex.Message}");
                return (null, new ErrorResponse { Message = "Server error." });
            }
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
        public Task<ErrorResponse?> DecideAppointmentPresaveAsync(int doctorUserId, int appointmentId, AppointmentDecisionRequest request)
        {
            try
            {
                _decideAppointmentState = new AppointmentDecisionWorkflowState
                {
                    DoctorUserId = doctorUserId,
                    AppointmentId = appointmentId,
                    Request = request
                };

                return Task.FromResult<ErrorResponse?>(null);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Decide appointment pre-save error: {ex.Message}");
                return Task.FromResult<ErrorResponse?>(new ErrorResponse { Message = "Server error." });
            }
        }

        /// <inheritdoc/>
        public async Task<ErrorResponse?> DecideAppointmentValidateAsync()
        {
            if (_decideAppointmentState == null)
            {
                return new ErrorResponse { Message = "Invalid appointment workflow state." };
            }

            (TBL04? appointment, ErrorResponse? commonError) = await ValidateDoctorAndGetOwnedAppointmentAsync(
                _decideAppointmentState.DoctorUserId,
                _decideAppointmentState.AppointmentId);
            if (commonError != null)
            {
                return commonError;
            }

            if (appointment!.L04F06 != AppointmentStatus.PENDING)
            {
                return new ErrorResponse { Message = "Only pending appointments can be approved or declined." };
            }

            _decideAppointmentState.Appointment = appointment;
            return null;
        }

        /// <inheritdoc/>
        public async Task<ErrorResponse?> DecideAppointmentSaveAsync()
        {
            try
            {
                if (_decideAppointmentState?.Appointment == null)
                {
                    return new ErrorResponse { Message = "Invalid appointment workflow state." };
                }

                _decideAppointmentState.Appointment.L04F06 = _decideAppointmentState.Request.Decision == AppointmentDecisionAction.APPROVE
                    ? AppointmentStatus.APPROVED
                    : AppointmentStatus.DECLINED;
                _decideAppointmentState.Appointment.L04F07 = _decideAppointmentState.Request.DoctorNotes;
                _decideAppointmentState.Appointment.L04F09 = DateTime.UtcNow;

                await _appointmentRepository.UpdateAppointmentAsync(_decideAppointmentState.Appointment);
                _decideAppointmentState = null;
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Decide appointment save error: {ex.Message}");
                return new ErrorResponse { Message = "Server error." };
            }
        }

        /// <inheritdoc/>
        public Task<ErrorResponse?> CancelFutureAppointmentPresaveAsync(int doctorUserId, int appointmentId, CancelAppointmentRequest request)
        {
            try
            {
                _cancelAppointmentState = new AppointmentCancelWorkflowState
                {
                    DoctorUserId = doctorUserId,
                    AppointmentId = appointmentId,
                    Request = request
                };

                return Task.FromResult<ErrorResponse?>(null);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Cancel appointment pre-save error: {ex.Message}");
                return Task.FromResult<ErrorResponse?>(new ErrorResponse { Message = "Server error." });
            }
        }

        /// <inheritdoc/>
        public async Task<ErrorResponse?> CancelFutureAppointmentValidateAsync()
        {
            if (_cancelAppointmentState == null)
            {
                return new ErrorResponse { Message = "Invalid appointment workflow state." };
            }

            (TBL04? appointment, ErrorResponse? commonError) = await ValidateDoctorAndGetOwnedAppointmentAsync(
                _cancelAppointmentState.DoctorUserId,
                _cancelAppointmentState.AppointmentId);
            if (commonError != null)
            {
                return commonError;
            }

            if (appointment!.L04F04 <= DateTime.UtcNow)
            {
                return new ErrorResponse { Message = "Only future appointments can be cancelled." };
            }

            if (appointment.L04F06 != AppointmentStatus.PENDING && appointment.L04F06 != AppointmentStatus.APPROVED)
            {
                return new ErrorResponse { Message = "Only pending or approved appointments can be cancelled." };
            }

            _cancelAppointmentState.Appointment = appointment;
            return null;
        }

        /// <inheritdoc/>
        public async Task<ErrorResponse?> CancelFutureAppointmentSaveAsync()
        {
            try
            {
                if (_cancelAppointmentState?.Appointment == null)
                {
                    return new ErrorResponse { Message = "Invalid appointment workflow state." };
                }

                _reflectionMapper.MapToExisting<CancelAppointmentRequest, TBL04>(
                    _cancelAppointmentState.Request,
                    _cancelAppointmentState.Appointment);
                _cancelAppointmentState.Appointment.L04F06 = AppointmentStatus.CANCELLED;
                _cancelAppointmentState.Appointment.L04F09 = DateTime.UtcNow;

                await _appointmentRepository.UpdateAppointmentAsync(_cancelAppointmentState.Appointment);
                _cancelAppointmentState = null;
                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Cancel appointment save error: {ex.Message}");
                return new ErrorResponse { Message = "Server error." };
            }
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// Validates doctor identity and ownership for a target appointment.
        /// </summary>
        /// <param name="doctorUserId">The doctor user identifier.</param>
        /// <param name="appointmentId">The appointment identifier.</param>
        /// <returns>A tuple containing appointment entity or validation error.</returns>
        private async Task<(TBL04? appointment, ErrorResponse? error)> ValidateDoctorAndGetOwnedAppointmentAsync(int doctorUserId, int appointmentId)
        {
            bool doctorExists = await _appointmentRepository.DoesDoctorExistAsync(doctorUserId);
            if (!doctorExists)
            {
                return (null, new ErrorResponse { Message = "Doctor profile not found." });
            }

            TBL04? appointment = await _appointmentRepository.FindAppointmentByIdAsync(appointmentId);
            if (appointment == null)
            {
                return (null, new ErrorResponse { Message = "Appointment not found." });
            }

            if (appointment.L04F03 != doctorUserId)
            {
                return (null, new ErrorResponse { Message = "You are not authorized to modify this appointment." });
            }

            return (appointment, null);
        }

        #endregion
    }
}
