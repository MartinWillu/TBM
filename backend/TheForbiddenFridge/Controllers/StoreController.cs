using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheForbiddenFridge.DTOs;
using TheForbiddenFridge.Models;
using TheForbiddenFridge.Repositories;

namespace TheForbiddenFridge.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StoreController(IStoreRepository storeRepository) : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(storeRepository.GetAll());
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var store = storeRepository.GetById(id);
        if (store == null)
        {
            return NotFound("Store not found");
        }

        return Ok(store);
    }

    [Authorize(Roles = "Admin, StoreOwner")]
    [HttpPost]
    public IActionResult Create([FromBody] StoreDTO storeDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var store = new Store
        {
            Name = storeDto.Name,
            LogoUrl = storeDto.LogoUrl ?? string.Empty,
            UserId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub)!)
        };

        storeRepository.Create(store);
        return CreatedAtAction(nameof(GetById), new { id = store.Id }, store);
    }

    [Authorize(Roles = "Admin, StoreOwner")]
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] StoreDTO storeDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingStore = storeRepository.GetById(id);
        if (existingStore == null)
        {
            return NotFound("Store not found");
        }

        var authResult = ValidateStoreOwnership(existingStore.UserId);
        if (authResult != null)
        {
            return authResult;
        }

        existingStore.Name = storeDto.Name;
        existingStore.LogoUrl = storeDto.LogoUrl ?? string.Empty;
        storeRepository.Update(existingStore);

        return Ok(existingStore);
    }

    [Authorize(Roles = "Admin, StoreOwner")]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var existingStore = storeRepository.GetById(id);
        if (existingStore == null)
        {
            return NotFound("Store not found");
        }

        var authResult = ValidateStoreOwnership(existingStore.UserId);
        if (authResult != null)
        {
            return authResult;
        }

        storeRepository.Delete(existingStore);
        return NoContent();
    }

    private ForbidResult? ValidateStoreOwnership(int storeOwnerId)
    {
        if (User.IsInRole("StoreOwner"))
        {
            var userId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub)!);
            if (storeOwnerId != userId)
            {
                return Forbid("You do not have permission to modify this store");
            }
        }
        return null;
    }
}