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
    public IActionResult GetGroceryByName(string name)
    {
        var groceries = _groceryService.GetGroceriesByName(name);
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

        var grocery = _groceryService.CreateGrocery(groceryDto);
        return CreatedAtAction(nameof(GetGroceryById), new { id = grocery.Id }, grocery);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateGrocery(int id, [FromBody] GroceryDTO groceryDto)
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

    [HttpDelete("{id}")]
    public IActionResult DeleteGrocery(int id)
    {
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
}