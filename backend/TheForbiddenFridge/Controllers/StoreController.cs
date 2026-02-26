using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheForbiddenFridge.DTOs;
using TheForbiddenFridge.Models;
using TheForbiddenFridge.Repositories;
using TheForbiddenFridge.Services;

namespace TheForbiddenFridge.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StoreController(IStoreService storeService) : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(storeService.GetAllStores());
    }

    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var store = storeService.GetStoreById(id);
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

        var userIdClaim = User.FindFirstValue(JwtRegisteredClaimNames.Sub);
        if (string.IsNullOrEmpty(userIdClaim))
        {
            return Unauthorized("User ID claim is missing or invalid.");
        }

        var store = new Store
        {
            Name = storeDto.Name,
            LogoUrl = storeDto.LogoUrl ?? string.Empty,
            UserId = int.Parse(userIdClaim)
        };

        storeService.CreateStore(store);
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

        var existingStore = storeService.GetStoreById(id);
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
        storeService.UpdateStore(id, storeDto);

        return Ok(existingStore);
    }

    [Authorize(Roles = "Admin, StoreOwner")]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var existingStore = storeService.GetStoreById(id);
        if (existingStore == null)
        {
            return NotFound("Store not found");
        }

        var authResult = ValidateStoreOwnership(existingStore.UserId);
        if (authResult != null)
        {
            return authResult;
        }

        storeService.DeleteStore(id);
        return NoContent();
    }

    private IActionResult? ValidateStoreOwnership(int storeOwnerId)
    {
        if (User.IsInRole("StoreOwner"))
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            {
                return Unauthorized("User ID not found in token");
            }

            if (storeOwnerId != userId)
            {
                return StatusCode(403, "You do not have permission to modify this store");
            }
        }
        return null;
    }
}