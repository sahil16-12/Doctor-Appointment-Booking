using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Services;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(IAuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupRequest request)
        {
            var error = await _authService.SignupAsync(request);
            
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

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var (response, error) = await _authService.LoginAsync(request);

            if (error != null)
            {
                return error.Message switch
                {
                    "Invalid credentials." => Unauthorized(error),
                    var msg when msg.Contains("registered as") => Unauthorized(error),
                    "Server error." => StatusCode(500, error),
                    _ => BadRequest(error)
                };
            }

            return Ok(response);
        }
    }
}
