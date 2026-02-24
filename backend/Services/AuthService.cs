using backend.DTOs;
using backend.Mapping;
using backend.Models;
using backend.Repositories;

namespace backend.Services
{
    /// <summary>
    /// Provides authentication and signup business logic.
    /// </summary>
    public class AuthService : IAuthService
    {
        #region Private Fields

        /// <summary>
        /// Represents the user repository dependency.
        /// </summary>
        private readonly IUserRepository _userRepository;

        /// <summary>
        /// Represents the token service dependency.
        /// </summary>
        private readonly ITokenService _tokenService;

        /// <summary>
        /// Represents the reflection mapper dependency.
        /// </summary>
        private readonly IReflectionMapper _reflectionMapper;

        #endregion

        #region Constructor

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthService"/> class.
        /// </summary>
        /// <param name="userRepository">The user repository.</param>
        /// <param name="tokenService">The token service.</param>
        /// <param name="reflectionMapper">The reflection mapper.</param>
        public AuthService(IUserRepository userRepository, ITokenService tokenService, IReflectionMapper reflectionMapper)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
            _reflectionMapper = reflectionMapper;
        }

        #endregion

        #region Public Methods

        /// <inheritdoc/>
        public async Task<ErrorResponse?> SignupAsync(SignupRequest request)
        {
            try
            {
                TBL01? existingUser = await _userRepository.FindUserByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    return new ErrorResponse { Message = "Email already registered." };
                }

                string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

                TBL01 user = _reflectionMapper.Map<SignupRequest, TBL01>(request);
                user.L01F07 = passwordHash;

                int userId = await _userRepository.CreateUserAsync(user);

                if (request.UserType == UserType.PATIENT)
                {
                    TBL02 patient = _reflectionMapper.Map<SignupRequest, TBL02>(request);
                    patient.L02F02 = userId;
                    await _userRepository.CreatePatientAsync(patient);
                }
                else if (request.UserType == UserType.DOCTOR)
                {
                    TBL03 doctor = _reflectionMapper.Map<SignupRequest, TBL03>(request);
                    doctor.L03F02 = userId;
                    await _userRepository.CreateDoctorAsync(doctor);
                }

                return null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Signup error: {ex.Message}");
                return new ErrorResponse { Message = "Server error." };
            }
        }

        /// <inheritdoc/>
        public async Task<(LoginResponse? response, ErrorResponse? error)> LoginAsync(LoginRequest request)
        {
            try
            {
                TBL01? user = await _userRepository.FindUserByEmailAsync(request.Email);

                if (user == null)
                {
                    return (null, new ErrorResponse { Message = "Invalid credentials." });
                }

                if (user.L01F02 != request.UserType)
                {
                    return (null, new ErrorResponse
                    {
                        Message = $"You are registered as {user.L01F02}. Please login as {user.L01F02}."
                    });
                }

                bool isMatch = BCrypt.Net.BCrypt.Verify(request.Password, user.L01F07);
                if (!isMatch)
                {
                    return (null, new ErrorResponse { Message = "Invalid credentials." });
                }

                string token = _tokenService.GenerateToken(user.L01F01, user.L01F02);

                object profile;
                if (user.L01F02 == UserType.PATIENT)
                {
                    PatientProfile patientProfile = _reflectionMapper.Map<TBL01, PatientProfile>(user);
                    TBL02? patient = await _userRepository.FindPatientByUserIdAsync(user.L01F01);
                    if (patient != null)
                    {
                        _reflectionMapper.MapToExisting<TBL02, PatientProfile>(patient, patientProfile);
                    }

                    profile = patientProfile;
                }
                else
                {
                    DoctorProfile doctorProfile = _reflectionMapper.Map<TBL01, DoctorProfile>(user);
                    TBL03? doctor = await _userRepository.FindDoctorByUserIdAsync(user.L01F01);
                    if (doctor != null)
                    {
                        _reflectionMapper.MapToExisting<TBL03, DoctorProfile>(doctor, doctorProfile);
                    }

                    profile = doctorProfile;
                }

                LoginResponse response = new LoginResponse
                {
                    Message = "Login successful.",
                    Token = token,
                    Profile = profile
                };

                return (response, null);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Login error: {ex.Message}");
                return (null, new ErrorResponse { Message = "Server error." });
            }
        }

        #endregion
    }
}
