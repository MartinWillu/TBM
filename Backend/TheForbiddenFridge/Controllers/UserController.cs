using Microsoft.AspNetCore.Mvc;
using TheForbiddenFridge.Models;
using TheForbiddenFridge.Repositories;

namespace TheForbiddenFridge.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController(IUserRepository userRepository, IRoleRepository roleRepository) : ControllerBase
{
  
    [HttpPost]
    public IActionResult Create(string name)
    {
        var role = roleRepository.GetAll().FirstOrDefault(r => r.Name == "User");
        if (role == null)
        {
            role = new Role { Name = "User" };
            roleRepository.Create(role);
        }

        var testUser = new User
        {
            Password = "strong hashed and salted",
            Username = name,
            Role = role
        };

        userRepository.Create(testUser);
        return Ok("created");
    }
}