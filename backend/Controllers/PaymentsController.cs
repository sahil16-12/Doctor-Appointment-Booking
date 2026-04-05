using backend.DTOs;
using backend.Extensions;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly StripeSettings _stripeSettings;

    public PaymentsController(IPaymentService paymentService, IOptions<StripeSettings> stripeSettings)
    {
        _paymentService = paymentService;
        _stripeSettings = stripeSettings.Value;
    }

    [HttpGet("config")]
    [AllowAnonymous]
    public IActionResult GetConfig()
    {
        return Ok(new { publishableKey = _stripeSettings.PublishableKey });
    }

    [HttpPost("create-intent")]
    [Authorize(Roles = "PATIENT")]
    public async Task<IActionResult> CreatePaymentIntent([FromBody] CreatePaymentIntentRequest request)
    {
        CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();
        var response = await _paymentService.CreatePaymentIntentAsync(currentUser.UserId, request);
        return Ok(response);
    }

    [HttpPost("confirm")]
    [Authorize(Roles = "PATIENT")]
    public async Task<IActionResult> ConfirmPayment([FromBody] ConfirmPaymentRequest request)
    {
        CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();
        var response = await _paymentService.ConfirmPaymentAndCreateAppointmentAsync(currentUser.UserId, request);
        return Ok(response);
    }

    [HttpGet("appointment/{appointmentId}")]
    public async Task<IActionResult> GetPaymentByAppointmentId(int appointmentId)
    {
        CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();
        var response = await _paymentService.GetPaymentByAppointmentIdAsync(
            appointmentId, 
            currentUser.UserId, 
            currentUser.Role.ToString()
        );
        return Ok(response);
    }

    [HttpGet("my-payments")]
    public async Task<IActionResult> GetMyPayments()
    {
        CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();
        var response = await _paymentService.GetMyPaymentsAsync(currentUser.UserId, currentUser.Role.ToString());
        return Ok(response);
    }

    [HttpPost("refund/{appointmentId}")]
    [Authorize(Roles = "DOCTOR")]
    public async Task<IActionResult> RefundPayment(int appointmentId, [FromBody] RefundRequest request)
    {
        await _paymentService.RefundPaymentAsync(appointmentId, request.Reason);
        return Ok(new { message = "Refund processed successfully" });
    }

    [HttpGet("earnings")]
    [Authorize(Roles = "DOCTOR")]
    public async Task<IActionResult> GetDoctorEarnings()
    {
        CurrentUserContext currentUser = HttpContext.GetCurrentUserContext();
        var response = await _paymentService.GetDoctorEarningsAsync(currentUser.UserId);
        return Ok(response);
    }
}

public class RefundRequest
{
    public string Reason { get; set; } = "Appointment cancelled";
}
