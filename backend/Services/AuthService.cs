using System.Text.RegularExpressions;
using backend.DTOs;
using backend.Models;
using backend.Repositories;
using BCrypt.Net;

namespace backend.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly ITokenService _tokenService;

        public AuthService(IUserRepository userRepository, ITokenService tokenService)
        {
            _userRepository = userRepository;
            _tokenService = tokenService;
        }

        public async Task<ErrorResponse?> SignupAsync(SignupRequest request)
        {
            // 1. Required fields validation
            if (string.IsNullOrWhiteSpace(request.FullName) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Phone) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return new ErrorResponse { Message = "All required fields must be filled." };
            }

            // 2. Field validations
            if (!Enum.IsDefined(typeof(UserType), request.UserType))
            {
                return new ErrorResponse { Message = "Invalid user type." };
            }

            if (!IsValidName(request.FullName))
            {
                return new ErrorResponse { Message = "Full name must contain only letters and be at least 3 characters." };
            }

            if (!IsValidEmail(request.Email))
            {
                return new ErrorResponse { Message = "Invalid email format." };
            }

            if (!IsValidPhone(request.Phone))
            {
                return new ErrorResponse { Message = "Phone must be exactly 10 digits." };
            }

            if (request.Password.Length < 6)
            {
                return new ErrorResponse { Message = "Password must be at least 6 characters." };
            }

            // 3. Optional field validation
            if (!string.IsNullOrWhiteSpace(request.EmergencyContact) && !IsValidPhone(request.EmergencyContact))
            {
                return new ErrorResponse { Message = "Emergency contact must be 10 digits." };
            }

            if (!string.IsNullOrWhiteSpace(request.Allergies) && request.Allergies.Length < 3)
            {
                return new ErrorResponse { Message = "Allergies must be at least 3 characters." };
            }

            if (request.UserType == UserType.DOCTOR)
            {
                if (!string.IsNullOrWhiteSpace(request.Specialization) && request.Specialization.Length < 3)
                {
                    return new ErrorResponse { Message = "Specialization must be at least 3 characters." };
                }

                if (!string.IsNullOrWhiteSpace(request.LicenseNumber) && request.LicenseNumber.Length < 5)
                {
                    return new ErrorResponse { Message = "License number must be at least 5 characters." };
                }

                if (request.YearsExperience.HasValue &&
                    (request.YearsExperience < 0 || request.YearsExperience > 60))
                {
                    return new ErrorResponse { Message = "Years of experience must be between 0 and 60." };
                }
            }

            try
            {
                // Check if user already exists
                var existingUser = await _userRepository.FindUserByEmailAsync(request.Email);
                if (existingUser != null)
                {
                    return new ErrorResponse { Message = "Email already registered." };
                }

                // Hash password
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

                // Create user
                var user = new User
                {
                    UserType = request.UserType,
                    FullName = request.FullName,
                    Email = request.Email,
                    Phone = request.Phone,
                    Dob = request.Dob,
                    Password = passwordHash
                };

                var userId = await _userRepository.CreateUserAsync(user);

                // Create patient or doctor record
                if (request.UserType == UserType.PATIENT)
                {
                    var patient = new Patient
                    {
                        UserId = userId,
                        EmergencyContact = request.EmergencyContact,
                        Allergies = request.Allergies
                    };
                    await _userRepository.CreatePatientAsync(patient);
                }
                else if (request.UserType == UserType.DOCTOR)
                {
                    var doctor = new Doctor
                    {
                        UserId = userId,
                        Specialization = request.Specialization,
                        LicenseNumber = request.LicenseNumber,
                        YearsExperience = request.YearsExperience
                    };
                    await _userRepository.CreateDoctorAsync(doctor);
                }

                return null; // Success
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Signup error: {ex.Message}");
                return new ErrorResponse { Message = "Server error." };
            }
        }

        public async Task<(LoginResponse? response, ErrorResponse? error)> LoginAsync(LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return (null, new ErrorResponse { Message = "All fields are required." });
            }

            try
            {
                var user = await _userRepository.FindUserByEmailAsync(request.Email);

                if (user == null)
                {
                    return (null, new ErrorResponse { Message = "Invalid credentials." });
                }

                // ROLE CHECK
                if (user.UserType != request.UserType)
                {
                    return (null, new ErrorResponse
                    {
                        Message = $"You are registered as {user.UserType}. Please login as {user.UserType}."
                    });
                }

                // Verify password
                var isMatch = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
                if (!isMatch)
                {
                    return (null, new ErrorResponse { Message = "Invalid credentials." });
                }

                // Generate JWT token
                var token = _tokenService.GenerateToken(user.Id, user.UserType);

                // Get full profile
                object profile;
                if (user.UserType == UserType.PATIENT)
                {
                    profile = await _userRepository.FindPatientByUserIdAsync(user.Id) ?? new object();
                }
                else
                {
                    profile = await _userRepository.FindDoctorByUserIdAsync(user.Id) ?? new object();
                }

                var response = new LoginResponse
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

        // Validation helper methods
        private bool IsValidEmail(string email)
        {
            return Regex.IsMatch(email, @"^[^\s@]+@[^\s@]+\.[^\s@]+$");
        }

        private bool IsValidPhone(string phone)
        {
            return Regex.IsMatch(phone, @"^[0-9]{10}$");
        }

        private bool IsValidName(string name)
        {
            return Regex.IsMatch(name, @"^[a-zA-Z ]{3,}$");
        }
    }
}
