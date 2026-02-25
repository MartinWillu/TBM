using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheForbiddenFridge.Models;
using TheForbiddenFridge.Repositories;
using TheForbiddenFridge.Services;

namespace TheForbiddenFridge.Controllers;


[ApiController]
[Route("api/[controller]")]
public class CategoryController(ICategoryService categoryService) : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        var categories = categoryService.GetAllCategories();
        return Ok(categories);
    }


    [HttpGet("{id}")]
    public IActionResult GetById(int id)
    {
        var category = categoryService.GetCategoryById(id);
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
        categoryService.CreateCategory(newCategory);
        return Ok("Category created");
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] CategoryDTO category)
    {
        var existingCategory = categoryService.GetCategoryById(id);
        if (existingCategory == null)
        {
            return NotFound("Category not found");
        }

        existingCategory.Name = category.Name;
        categoryService.UpdateCategory(id, existingCategory);
        return Ok("Category updated");
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public IActionResult Delete(int id)
    {
        var existingCategory = categoryService.GetCategoryById(id);
        if (existingCategory == null)
        {
            return NotFound("Category not found");
        }

        categoryService.DeleteCategory(id);
        return Ok("Category deleted");
    }
}