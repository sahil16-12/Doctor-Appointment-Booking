using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using backend.DTOs;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    /// <summary>
    /// Exposes appointment booking endpoints for patients and doctors.
    /// </summary>
    [ApiController]
    [Authorize]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        #region Private Fields

        /// <summary>
        /// Represents appointment service dependency.
        /// </summary>
        private readonly IAppointmentService _appointmentService;

        #endregion

        #region Constructor

        /// <summary>
        /// Initializes a new instance of the <see cref="AppointmentsController"/> class.
        /// </summary>
        /// <param name="appointmentService">The appointment service.</param>
        public AppointmentsController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        #endregion

        #region Patient Endpoints

        /// <summary>
        /// Retrieves available doctors for appointment booking.
        /// </summary>
        /// <returns>A list of available doctors.</returns>
        [HttpGet("doctors/available")]
        public async Task<IActionResult> GetAvailableDoctors()
        {
            (int userId, UserType role, ErrorResponse? authError) = GetCurrentUserContext();
            if (authError != null)
            {
                return Unauthorized(authError);
            }

            if (role != UserType.PATIENT)
            {
                return Forbid();
            }

            (List<AvailableDoctorResponse>? response, ErrorResponse? error) = await _appointmentService.GetAvailableDoctorsAsync(userId);
            if (error != null)
            {
                return BadRequest(error);
            }

            return Ok(response);
        }

        /// <summary>
        /// Creates a new appointment request by patient.
        /// </summary>
        /// <param name="request">The booking request payload.</param>
        /// <returns>The created appointment details.</returns>
        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] CreateAppointmentRequest request)
        {
            (int userId, UserType role, ErrorResponse? authError) = GetCurrentUserContext();
            if (authError != null)
            {
                return Unauthorized(authError);
            }

            if (role != UserType.PATIENT)
            {
                return Forbid();
            }

            (AppointmentResponse? response, ErrorResponse? error) = await _appointmentService.CreateAppointmentAsync(userId, request);
            if (error != null)
            {
                return error.Message switch
                {
                    "Doctor not found." => NotFound(error),
                    _ => BadRequest(error)
                };
            }

            return StatusCode(201, response);
        }

        #endregion

        #region Doctor Endpoints

        /// <summary>
        /// Retrieves doctor pending appointment requests.
        /// </summary>
        /// <returns>A list of pending appointments.</returns>
        [HttpGet("doctor/pending")]
        public async Task<IActionResult> GetPendingAppointments()
        {
            (int userId, UserType role, ErrorResponse? authError) = GetCurrentUserContext();
            if (authError != null)
            {
                return Unauthorized(authError);
            }

            if (role != UserType.DOCTOR)
            {
                return Forbid();
            }

            (List<AppointmentResponse>? response, ErrorResponse? error) = await _appointmentService.GetPendingAppointmentsAsync(userId);
            if (error != null)
            {
                return BadRequest(error);
            }

            return Ok(response);
        }

        /// <summary>
        /// Approves or declines a pending appointment.
        /// </summary>
        /// <param name="appointmentId">The appointment identifier.</param>
        /// <param name="request">The decision request payload.</param>
        /// <returns>A status response for decision action.</returns>
        [HttpPut("{appointmentId:int}/decision")]
        public async Task<IActionResult> DecideAppointment(int appointmentId, [FromBody] AppointmentDecisionRequest request)
        {
            (int userId, UserType role, ErrorResponse? authError) = GetCurrentUserContext();
            if (authError != null)
            {
                return Unauthorized(authError);
            }

            if (role != UserType.DOCTOR)
            {
                return Forbid();
            }

            ErrorResponse? error = await _appointmentService.DecideAppointmentAsync(userId, appointmentId, request);
            if (error != null)
            {
                return error.Message switch
                {
                    "Appointment not found." => NotFound(error),
                    "You are not authorized to modify this appointment." => Forbid(),
                    _ => BadRequest(error)
                };
            }

            return Ok(new { message = "Appointment updated successfully." });
        }

        /// <summary>
        /// Cancels a future appointment by doctor.
        /// </summary>
        /// <param name="appointmentId">The appointment identifier.</param>
        /// <param name="request">The cancellation request payload.</param>
        /// <returns>A status response for cancellation action.</returns>
        [HttpPut("{appointmentId:int}/cancel")]
        public async Task<IActionResult> CancelFutureAppointment(int appointmentId, [FromBody] CancelAppointmentRequest request)
        {
            (int userId, UserType role, ErrorResponse? authError) = GetCurrentUserContext();
            if (authError != null)
            {
                return Unauthorized(authError);
            }

            if (role != UserType.DOCTOR)
            {
                return Forbid();
            }

            ErrorResponse? error = await _appointmentService.CancelFutureAppointmentAsync(userId, appointmentId, request);
            if (error != null)
            {
                return error.Message switch
                {
                    "Appointment not found." => NotFound(error),
                    "You are not authorized to modify this appointment." => Forbid(),
                    _ => BadRequest(error)
                };
            }

            return Ok(new { message = "Appointment cancelled successfully." });
        }

        #endregion

        #region Private Methods

        /// <summary>
        /// Extracts authenticated user identifier and role from token claims.
        /// </summary>
        /// <returns>A tuple with user id, role, and optional error response.</returns>
        private (int userId, UserType role, ErrorResponse? error) GetCurrentUserContext()
        {
            string? idClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
            string? roleClaim = User.FindFirstValue(ClaimTypes.Role);

            bool isUserIdValid = int.TryParse(idClaim, out int userId);
            bool isRoleValid = Enum.TryParse(roleClaim, true, out UserType role);

            if (!isUserIdValid || !isRoleValid)
            {
                return (0, UserType.PATIENT, new ErrorResponse
                {
                    Message = "Invalid authentication token."
                });
            }

            return (userId, role, null);
        }

        #endregion
    }
}
