using backend.DTOs;

namespace backend.Services
{
    public interface IAuthService
    {
        Task<ErrorResponse?> SignupAsync(SignupRequest request);
        Task<(LoginResponse? response, ErrorResponse? error)> LoginAsync(LoginRequest request);
    }
}
