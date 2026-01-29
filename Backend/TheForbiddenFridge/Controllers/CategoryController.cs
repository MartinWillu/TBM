using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TheForbiddenFridge.Models;
using TheForbiddenFridge.Repositories;

namespace TheForbiddenFridge.Controllers;


[ApiController]
[Microsoft.AspNetCore.Components.Route("api/[controller]")]
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

    [Authorize(Roles = "Admin, StoreOwner")]
    [HttpPost]
    public IActionResult Create([FromBody] Category category)
    {
        categoryRepository.Create(category);
        return Ok("Category created");
    }

    [Authorize(Roles = "Admin, StoreOwner")]
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] Category category)
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

    [Authorize(Roles = "Admin, StoreOwner")]
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