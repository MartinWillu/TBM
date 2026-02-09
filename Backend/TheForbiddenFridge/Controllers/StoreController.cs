using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
    public IActionResult Create([FromBody] Store store)
    {
        store.UserId = int.Parse(User.FindFirstValue(JwtRegisteredClaimNames.Sub));
        storeRepository.Create(store);
        return Ok(store);
    }

    [Authorize(Roles = "Admin, StoreOwner")]
    [HttpPut("{id}")]
    public IActionResult Update(int id, [FromBody] Store store)
    {
        var existingStore = storeRepository.GetById(id);
        if (existingStore == null)
        {
            return NotFound("Store not found");
        }

        if (User.IsInRole("StoreOwner"))
        {
            if (existingStore.UserId.ToString() != User.FindFirstValue(JwtRegisteredClaimNames.Sub))
            {
                return Forbid("You do not have permission to update this store");
            }

            ;
        }

        existingStore.Name = store.Name;
        existingStore.LogoUrl = store.LogoUrl;
        storeRepository.Update(existingStore);

        return Ok(existingStore);
    }

    [Authorize(Roles = "Admin, StoreOwner")]
    [HttpDelete("{id}")]
    public IActionResult Delete(int Id)
    {
        var existingStore = storeRepository.GetById(Id);
        if (existingStore == null)
        {
            return NotFound("Store not found");
        }

        if (User.IsInRole("StoreOwner"))
        {
            if (existingStore.UserId.ToString() != User.FindFirstValue(JwtRegisteredClaimNames.Sub))
            {
                return Forbid("You do not have permission to update this store");
            }
        }

        storeRepository.Delete(existingStore);
        return Ok("Deleted store with id: " + Id);
    }
}