using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheForbiddenFridge.DTOs;
using TheForbiddenFridge.Models;
using TheForbiddenFridge.Repositories;
using TheForbiddenFridge.Service;
using TheForbiddenFridge.Services;

namespace TheForbiddenFridge.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IUserService userService, JwtIssuerService jwtService, CryptService cryptService)
    : ControllerBase
{
    [AllowAnonymous]
    [HttpPost("register")]
    public IActionResult Register([FromBody] LoginDTO register)
    {
        if (userService.GetAllUsers().Any(user => user.Username == register.Username))
        {
            return Unauthorized("Username already exists");
        }

        string hashedPassword = cryptService.HashPassword(register.Password);

        var user = new User(register.Username, hashedPassword)
        {
            Role = new Role { Name = "User" }
        };
        userService.CreateUser(user);
        return Ok("created user with username: " + register.Username);
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginDTO login)
    {
        var user = userService.GetAllUsers().FirstOrDefault(user => user.Username == login.Username);
        if (user == null)
        {
            Console.WriteLine("No user found with username: " + login.Username);
            return NotFound("User not found");
        }

        bool verified = cryptService.VerifyPassword(login.Password, user.Password);
        if (!verified)
        {
            Console.WriteLine("Password verification failed for user: " + login.Username);
            return Unauthorized("Invalid password");
        }

        Console.WriteLine("User authenticated successfully: " + user.Username);
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