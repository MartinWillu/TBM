using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheForbiddenFridge.DTOs;
using TheForbiddenFridge.Repositories;
using TheForbiddenFridge.Service;

namespace TheForbiddenFridge.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController(IUserRepository userRepository, CryptService cryptService) : ControllerBase
{
    [HttpPut]
    [Authorize(Roles = "Admin, StoreOwner, User")]
    public IActionResult Put([FromBody] UserUpdateDTO updatedUser)
    {
        if (!int.TryParse(User.FindFirstValue(JwtRegisteredClaimNames.Sub), out var userId))
        {
            return Unauthorized("Invalid user ID in token.");
        }

        var user = userRepository.GetById(userId);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        if (!string.IsNullOrEmpty(updatedUser.Username))
        {
            user.Username = updatedUser.Username;
        }

        if (!string.IsNullOrEmpty(updatedUser.Password))
        {
            user.Password = cryptService.HashPassword(updatedUser.Password);
        }
        
        userRepository.Update(user);
        return Ok(user);
    }
    
    
    [HttpDelete]
    [Authorize(Roles = "Admin, StoreOwner, User")]
    public IActionResult Delete()
    {
        if (!int.TryParse(User.FindFirstValue(JwtRegisteredClaimNames.Sub), out var userId))
        {
            return Unauthorized("Invalid user ID in token.");
        }

        var user = userRepository.GetById(userId);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        userRepository.Delete(user);
        return Ok("Deleted user account");
    }
}