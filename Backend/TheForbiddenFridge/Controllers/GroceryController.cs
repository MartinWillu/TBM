using Microsoft.AspNetCore.Mvc;
using TheForbiddenFridge.Repositories;

namespace TheForbiddenFridge.Controllers;


    [ApiController]
    [Route("api/[controller]")]
    public class GroceryController(IStoreRepository storeRepository, IGroceryRepository groceryRepository) : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAllGroceries()
        {
            return Ok(groceryRepository.GetAll());
        }
        
        [HttpGet]
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

        [HttpGet]
        public IActionResult GetAllGroceryByCategory(string categoryName)
        { 
            var groceries = groceryRepository.GetAll().Where(g => g.Categories.Any(c => c.Name == categoryName));
            if (groceries != null)
            {
                return Ok(groceries);
            }

            return NotFound("No groceries found for the specified category");
        }
        
        [HttpGet]
        public IActionResult GetAllGrocieresByStoreIdAndCategoryId(int storeId, string categoryName)
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

        [HttpGet]
        public IActionResult GetGroceryByName(string name)
        {
            var grocery = groceryRepository.GetAll().Where(g => g.Name == name);
            if (grocery != null)
            {
                return Ok(grocery);
            }
            return NotFound($"Grocery not found for this name: {name}");
        }
    }
