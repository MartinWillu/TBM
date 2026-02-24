using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheForbiddenFridge.Models;
using TheForbiddenFridge.Repositories;

namespace TheForbiddenFridge.Controllers;


[ApiController]
[Route("api/[controller]")]
public class CategoryController(ICategoryRepository categoryRepository) : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        var categories = categoryRepository.GetAll();
        return Ok(categories);
    }


    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var category = categoryRepository.GetById(id);
        if (category == null)
        {
            return NotFound("Category not found");
        }

        return Ok(category);

    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public IActionResult Create([FromBody] CategoryDTO category)
    {
        if (category.Name == null || string.IsNullOrEmpty(category.Name))
        {
            return BadRequest("Category name is required");
        }
        var newCategory = new Category() { Name = category.Name };
        categoryRepository.Create(newCategory);
        return Ok("Category created");
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] CategoryDTO category)
    {
        var existingCategory = categoryRepository.GetById(id);
        if (existingCategory == null)
        {
            return NotFound("Category not found");
        }

        existingCategory.Name = category.Name;
        categoryRepository.Update(existingCategory);
        return Ok("Category updated");
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var existingCategory = categoryRepository.GetById(id);
        if (existingCategory == null)
        {
            return NotFound("Category not found");
        }

        categoryRepository.Delete(existingCategory);
        return Ok("Category deleted");
    }
}