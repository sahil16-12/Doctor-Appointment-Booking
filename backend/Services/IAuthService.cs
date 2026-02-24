using backend.DTOs;

namespace backend.Services
{
    /// <summary>
    /// Defines authentication and registration operations.
    /// </summary>
    public interface IAuthService
    {
        #region Public Methods

        /// <summary>
        /// Registers a new user.
        /// </summary>
        /// <param name="request">The signup request data.</param>
        /// <returns>An error response when signup fails; otherwise null.</returns>
        Task<ErrorResponse?> SignupAsync(SignupRequest request);

        /// <summary>
        /// Authenticates an existing user.
        /// </summary>
        /// <param name="request">The login request data.</param>
        /// <returns>A tuple containing login response or error details.</returns>
        Task<(LoginResponse? response, ErrorResponse? error)> LoginAsync(LoginRequest request);

        #endregion
    }
}
