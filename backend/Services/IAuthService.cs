using backend.DTOs;
using backend.Models;

namespace backend.Services
{
    /// <summary>
    /// Defines authentication and registration operations.
    /// </summary>
    public interface IAuthService
    {
        #region Public Methods

        /// <summary>
        /// Performs pre-save mapping for signup and stores workflow state.
        /// </summary>
        /// <param name="request">The signup request data.</param>
        /// <returns>A tuple containing mapped user POCO or error details.</returns>
        Task<(TBL01? user, ErrorResponse? error)> PreSaveAsync(SignupRequest request);

        /// <summary>
        /// Performs signup validations that require data-store access.
        /// </summary>
        /// <returns>An error response when validation fails; otherwise null.</returns>
        Task<ErrorResponse?> ValidateAsync();

        /// <summary>
        /// Persists signup workflow state to data-store.
        /// </summary>
        /// <returns>An error response when persistence fails; otherwise null.</returns>
        Task<ErrorResponse?> SaveAsync();

        /// <summary>
        /// Authenticates an existing user.
        /// </summary>
        /// <param name="request">The login request data.</param>
        /// <returns>A tuple containing login response or error details.</returns>
        Task<(LoginResponse? response, ErrorResponse? error)> LoginAsync(LoginRequest request);

        #endregion
    }
}
