using Microsoft.AspNetCore.Mvc;
using TheForbiddenFridge.Models;
using TheForbiddenFridge.Repositories;

namespace TheForbiddenFridge.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController(IUserRepository userRepository) : ControllerBase
{
  
    [HttpGet]
    public User Get(int id)
    {
        return userRepository.GetById(id);
    }
}