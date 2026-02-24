using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheForbiddenFridge.DTOs;
using TheForbiddenFridge.Models;
using TheForbiddenFridge.Repositories;
using TheForbiddenFridge.Service;

namespace TheForbiddenFridge.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController(IUserRepository userRepository, IRoleRepository roleRepository, CryptService cryptService) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public IActionResult GetAll()
    {
        return Ok(userRepository.GetUserInfoDTOs());
    }


    [HttpPatch("{id}")]
    [Authorize(Roles = "Admin")]
    public IActionResult Patch(int id, string role)
    {
        var availableRoles = new List<string>() { "1", "2", "3" };
        if (availableRoles.Find(r => r == role) != null)
        {
            return BadRequest($"Role not available: {role}.");
        }

        var targetUser = userRepository.GetById(id);
        if (targetUser == null)
        {
            return NotFound($"User with id {id} found.");
        }
        var savedRole = roleRepository.GetRoleByName(role);
        if (savedRole == null)
        {
            return NotFound($"Role with name {role} not found.");
        }

        targetUser.Role = savedRole;
        targetUser.RoleId = savedRole.Id;
        userRepository.Update(targetUser);

        return Ok($"Updated {targetUser.Username} with role {savedRole.Name}!");
    }

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