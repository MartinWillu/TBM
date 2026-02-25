using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
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
public class UserController(IUserService userService, IRoleService roleService) : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public IActionResult GetAll()
    {
        return Ok(userService.GetAllUsers());
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

        var targetUser = userService.GetUserById(id);
        if (targetUser == null)
        {
            return NotFound($"User with id {id} found.");
        }
        var savedRole = roleService.GetRoleByName(role);
        if (savedRole == null)
        {
            return NotFound($"Role with name {role} not found.");
        }

        targetUser.Role = savedRole;
        targetUser.RoleId = savedRole.Id;
        userService.UpdateUser(id, targetUser);

        return Ok($"Updated {targetUser.Username} with role {savedRole.Name}!");
    }

    [HttpPut]
    [Authorize(Roles = "Admin, StoreOwner, User")]
    public IActionResult Put([FromBody] UserUpdateDTO updatedUser)
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
        {
            return Unauthorized("Invalid user ID in token.");
        }

        try
        {
            var user = userService.UpdateUser(userId, updatedUser);
            return Ok(user);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return NotFound(ex.Message);
        }
    }


    [HttpDelete]
    [Authorize(Roles = "Admin, StoreOwner, User")]
    public IActionResult Delete()
    {
        if (!int.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
        {
            return Unauthorized("Invalid user ID in token.");
        }

        var user = userService.GetUserById(userId);
        if (user == null)
        {
            return NotFound("User not found.");
        }

        userService.DeleteUser(userId);
        return Ok("Deleted user account");
    }
}