using Microsoft.AspNetCore.Mvc;
using TheForbiddenFridge.DTOs;
using TheForbiddenFridge.Models;
using TheForbiddenFridge.Repositories;

namespace TheForbiddenFridge.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GroceryController(
    IStoreRepository storeRepository,
    IGroceryRepository groceryRepository,
    ICategoryRepository categoryRepository) : ControllerBase
{
    [HttpGet]
    public IActionResult GetAllGroceries()
    {
        return Ok(groceryRepository.GetAll());
    }

    [HttpGet("store/{storeId}")]
    public IActionResult GetAllGroceriesByStoreId(int storeId)
    {
        var store = storeRepository.GetById(storeId);
        if (store == null)
        {
            return NotFound("Store not found");
        }

        var groceries = groceryRepository.GetAll().Where(g => g.StoreId == storeId);
        return Ok(groceries);
    }

    [HttpGet("category/{categoryName}")]
    public IActionResult GetAllGroceryByCategory(string categoryName)
    {
        var groceries = groceryRepository.GetAll().Where(g => g.Categories.Any(c => c.Name == categoryName));
        if (groceries != null)
        {
            return Ok(groceries);
        }

        return NotFound("No groceries found for the specified category");
    }

    [HttpGet("store/{storeId}/category/{categoryName}")]
    public IActionResult GetAllGrocieresByStoreIdAndCategoryName(int storeId, string categoryName)
    {
        var store = storeRepository.GetById(storeId);
        if (store == null)
        {
            return NotFound("Store not found");
        }

        var groceries = groceryRepository.GetAll()
            .Where(g => g.StoreId == storeId && g.Categories.Any(c => c.Name == categoryName));

        if (groceries != null)
        {
            return Ok(groceries);
        }

        return NotFound("No groceries found for the specified category in this store");
    }

    [HttpGet("name/{name}")]
    public IActionResult GetGroceryByName(string name)
    {
        var grocery = groceryRepository.GetAll().Where(g => g.Name == name);
        if (grocery != null)
        {
            return Ok(grocery);
        }
        return NotFound($"Grocery not found for this name: {name}");
    }

    [HttpGet("{id}")]
    public IActionResult GetGroceryById(int id)
    {
        var grocery = groceryRepository.GetById(id);
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

        var store = storeRepository.GetById(groceryDto.StoreId);
        if (store == null)
        {
            return BadRequest($"Store with ID {groceryDto.StoreId} not found");
        }

        var category = categoryRepository.GetById(groceryDto.CategoryId);
        if (category == null)
        {
            return BadRequest($"Category with ID {groceryDto.CategoryId} not found");
        }

        var grocery = new Grocery
        {
            Name = groceryDto.Name,
            CurrentPrice = groceryDto.CurrentPrice,
            OldPrice = groceryDto.OldPrice,
            Quantity = groceryDto.Quantity,
            ImageUrl = groceryDto.ImageUrl ?? string.Empty,
            StoreId = groceryDto.StoreId,
            CategoryId = groceryDto.CategoryId
        };

        groceryRepository.Create(grocery);

        return CreatedAtAction(nameof(GetGroceryById), new { id = grocery.Id }, grocery);
    }

    [HttpPut("{id}")]
    public IActionResult UpdateGrocery(int id, [FromBody] GroceryDTO groceryDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var existingGrocery = groceryRepository.GetById(id);
        if (existingGrocery == null)
        {
            return NotFound($"Grocery with ID {id} not found");
        }

        var store = storeRepository.GetById(groceryDto.StoreId);
        if (store == null)
        {
            return BadRequest($"Store with ID {groceryDto.StoreId} not found");
        }

        var category = categoryRepository.GetById(groceryDto.CategoryId);
        if (category == null)
        {
            return BadRequest($"Category with ID {groceryDto.CategoryId} not found");
        }

        existingGrocery.Name = groceryDto.Name;
        existingGrocery.CurrentPrice = groceryDto.CurrentPrice;
        existingGrocery.OldPrice = groceryDto.OldPrice;
        existingGrocery.Quantity = groceryDto.Quantity;
        existingGrocery.ImageUrl = groceryDto.ImageUrl ?? string.Empty;
        existingGrocery.StoreId = groceryDto.StoreId;
        existingGrocery.CategoryId = groceryDto.CategoryId;

        groceryRepository.Update(existingGrocery);

        return Ok(existingGrocery);
    }

    [HttpDelete("{id}")]
    public IActionResult DeleteGrocery(int id)
    {
        var grocery = groceryRepository.GetById(id);
        if (grocery == null)
        {
            return NotFound($"Grocery with ID {id} not found");
        }

        groceryRepository.Delete(grocery);

        return NoContent();
    }
}
