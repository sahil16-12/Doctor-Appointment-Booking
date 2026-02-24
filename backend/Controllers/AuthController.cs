using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers
{
    /// <summary>
    /// Exposes authentication APIs for signup and login.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        #region Private Fields

        /// <summary>
        /// Represents the authentication service instance.
        /// </summary>
        private readonly IAuthService _authService;

        /// <summary>
        /// Represents the logger instance.
        /// </summary>
        private readonly ILogger<AuthController> _logger;

        #endregion

        #region Constructor

        /// <summary>
        /// Initializes a new instance of the <see cref="AuthController"/> class.
        /// </summary>
        /// <param name="authService">The authentication service.</param>
        /// <param name="logger">The logger instance.</param>
        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Registers a new user.
        /// </summary>
        /// <param name="request">The signup request payload.</param>
        /// <returns>An HTTP response indicating signup result.</returns>
        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupRequest request)
        {
            ErrorResponse? error = await _authService.SignupAsync(request);

            if (error != null)
            {
                return error.Message switch
                {
                    "Email already registered." => Conflict(error),
                    "Server error." => StatusCode(500, error),
                    _ => BadRequest(error)
                };
            }

            return StatusCode(201, new { message = "User registered successfully." });
        }

        /// <summary>
        /// Logs in an existing user.
        /// </summary>
        /// <param name="request">The login request payload.</param>
        /// <returns>An HTTP response containing token and profile on success.</returns>
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            (LoginResponse? response, ErrorResponse? error) = await _authService.LoginAsync(request);

            if (error != null)
            {
                return error.Message switch
                {
                    "Invalid credentials." => Unauthorized(error),
                    string message when message.Contains("registered as") => Unauthorized(error),
                    "Server error." => StatusCode(500, error),
                    _ => BadRequest(error)
                };
            }

            return Ok(response);
        }

        #endregion
    }
}
