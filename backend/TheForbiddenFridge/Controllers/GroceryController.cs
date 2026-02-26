using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheForbiddenFridge.DTOs;
using TheForbiddenFridge.Services;

namespace TheForbiddenFridge.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GroceryController(IGroceryService groceryService) : ControllerBase
{
    private readonly IGroceryService _groceryService = groceryService;

    [HttpGet]
    public IActionResult GetAllGroceries()
    {
        var groceries = _groceryService.GetAllGroceries();
        return Ok(groceries);
    }

    [HttpGet("store/{storeId}")]
    public IActionResult GetAllGroceriesByStoreId(int storeId)
    {
        if (!_groceryService.StoreExists(storeId))
        {
            return NotFound("Store not found");
        }

        var groceries = _groceryService.GetGroceriesByStoreId(storeId);
        return Ok(groceries);
    }

    [HttpGet("category/{categoryName}")]
    public IActionResult GetAllGroceryByCategory(string categoryName)
    {
        var groceries = _groceryService.GetGroceriesByCategory(categoryName);
        return Ok(groceries);
    }

    [HttpGet("store/{storeId}/category/{categoryName}")]
    public IActionResult GetAllGrocieresByStoreIdAndCategoryName(int storeId, string categoryName)
    {
        if (!_groceryService.StoreExists(storeId))
        {
            return NotFound("Store not found");
        }

        var groceries = _groceryService.GetGroceriesByStoreIdAndCategory(storeId, categoryName);
        return Ok(groceries);
    }

    [HttpGet("name/{name}")]
    public IActionResult GetGroceriesByName(string name)
    {
        if (string.IsNullOrEmpty(name))
        {
            return BadRequest("Grocery name is required");
        }
        var groceries = _groceryService.GetGroceriesByName(name);
        if (groceries == null || !groceries.Any())
        {
            return NotFound("No groceries found for the given name");
        }
        return Ok(groceries);
    }

    [HttpGet("{id}")]
    public IActionResult GetGroceryById(int id)
    {
        var grocery = _groceryService.GetGroceryById(id);
        if (grocery == null)
        {
            return NotFound($"Grocery with ID {id} not found");
        }
        return Ok(grocery);
    }

    [Authorize(Roles = "Admin, StoreOwner")]
    [HttpPost]
    public IActionResult CreateGrocery([FromBody] GroceryDTO groceryDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        if (!_groceryService.StoreExists(groceryDto.StoreId))
        {
            return BadRequest($"Store with ID {groceryDto.StoreId} not found");
        }

        if (!_groceryService.CategoryExists(groceryDto.CategoryId))
        {
            return BadRequest($"Category with ID {groceryDto.CategoryId} not found");
        }

        var authResult = ValidateStoreOwnership(groceryDto.StoreId);
        if (authResult != null)
        {
            return authResult;
        }

        var grocery = _groceryService.CreateGrocery(groceryDto);
        return CreatedAtAction(nameof(GetGroceryById), new { id = grocery.Id }, grocery);
    }

    [Authorize(Roles = "Admin, StoreOwner")]
    [HttpPut("{id}")]
    public IActionResult UpdateGrocery(int id, [FromBody] GroceryDTO groceryDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingGrocery = _groceryService.GetGroceryById(id);
        if (existingGrocery == null)
        {
            return NotFound($"Grocery with ID {id} not found");
        }

        if (!_groceryService.StoreExists(groceryDto.StoreId))
        {
            return BadRequest($"Store with ID {groceryDto.StoreId} not found");
        }

        if (!_groceryService.CategoryExists(groceryDto.CategoryId))
        {
            return BadRequest($"Category with ID {groceryDto.CategoryId} not found");
        }

        var authResult = ValidateStoreOwnership(existingGrocery.StoreId);
        if (authResult != null)
        {
            return authResult;
        }

        if (existingGrocery.StoreId != groceryDto.StoreId)
        {
            authResult = ValidateStoreOwnership(groceryDto.StoreId, "You do not have permission to move groceries to this store");
            if (authResult != null)
            {
                return authResult;
            }
        }

        try
        {
            var grocery = _groceryService.UpdateGrocery(id, groceryDto);
            return Ok(grocery);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    [Authorize(Roles = "Admin, StoreOwner")]
    [HttpDelete("{id}")]
    public IActionResult DeleteGrocery(int id)
    {
        var grocery = _groceryService.GetGroceryById(id);
        if (grocery == null)
        {
            return NotFound($"Grocery with ID {id} not found");
        }

        var authResult = ValidateStoreOwnership(grocery.StoreId);
        if (authResult != null)
        {
            return authResult;
        }

        try
        {
            _groceryService.DeleteGrocery(id);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
    }

    private IActionResult? ValidateStoreOwnership(int storeId, string? errorMessage = null)
    {
        if (User.IsInRole("StoreOwner"))
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? User.FindFirstValue("sub");
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out var userId))
            {
                return Unauthorized("User ID not found in token");
            }

            if (!_groceryService.UserOwnsStore(storeId, userId))
            {
                return StatusCode(403, errorMessage ?? "You do not have permission to modify this store's groceries");
            }
        }
        return null;
    }
}