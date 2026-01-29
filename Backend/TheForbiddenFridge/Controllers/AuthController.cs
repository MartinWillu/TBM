using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheForbiddenFridge.DTOs;
using TheForbiddenFridge.Models;
using TheForbiddenFridge.Repositories;
using TheForbiddenFridge.Service;

namespace TheForbiddenFridge.Controllers;

[ApiController]
[AllowAnonymous]
public class AuthController(IUserRepository userRepository, JwtIssuerService jwtService) : ControllerBase
{
    [HttpPost]
    public IActionResult Register([FromBody] LoginDTO register)
    {
        if (userRepository.GetAll().Any(user => user.Username == register.Username))
        {
            return Unauthorized("Username already exists");
        }
        string hashedPassword = BCrypt.Net.BCrypt.HashPassword(register.Password);
        
        var user = new User(register.Username, hashedPassword);
        user.Role = new Role { Name = "User" };
        userRepository.Create(user);
        return Ok("created user with username: " + register.Username);
    }
    
    
    [HttpPost]
    public IActionResult Login([FromBody] LoginDTO login)
    {
        var user = userRepository.GetAll().FirstOrDefault(user => user.Username == login.Username);
        if (user == null)
        {
            return NotFound("User not found");
        }
        bool verified = BCrypt.Net.BCrypt.Verify(login.Password, user.Password);
        if (!verified)
        {
            return Unauthorized("Invalid password");
        }

        var token = jwtService.CreateJwt(user.Id.ToString(), user.Username,
            new List<string>() { user.Role.Name });
        return Ok(token); 


    }
}