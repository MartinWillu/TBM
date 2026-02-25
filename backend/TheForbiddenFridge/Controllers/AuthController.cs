using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheForbiddenFridge.DTOs;
using TheForbiddenFridge.Service;
using TheForbiddenFridge.Services;

namespace TheForbiddenFridge.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IUserService userService, JwtIssuerService jwtService)
    : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("register")]
    public IActionResult Register([FromBody] LoginDTO register)
    {
        try
        {
            var user = userService.RegisterUser(register);
            return Ok("created user with username: " + user.Username);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDTO login)
    {
        var user = userService.VerifyUser(login);
        if (user == null)
        {
            return Unauthorized("Invalid credentials");
        }

        var token = jwtService.CreateJwt(user.Id.ToString(), user.Username, [user.Role.Name]);
        return Ok(token);
    }

    [Authorize(Roles = "Admin, StoreOwner, User")]
    [HttpGet("verify")]
    public IActionResult Verify()
    {
        return Ok("Authorized");
    }
}