using TheForbiddenFridge.DTOs;
using TheForbiddenFridge.Models;
using TheForbiddenFridge.Repositories;

namespace TheForbiddenFridge.Services;

public class GroceryService(
    IGroceryRepository groceryRepository,
    IStoreRepository storeRepository,
    ICategoryRepository categoryRepository) : IGroceryService
{
    private readonly IGroceryRepository _groceryRepository = groceryRepository;
    private readonly IStoreRepository _storeRepository = storeRepository;
    private readonly ICategoryRepository _categoryRepository = categoryRepository;

    public IEnumerable<Grocery> GetAllGroceries()
    {
        return _groceryRepository.GetAll();
    }

    public IEnumerable<Grocery> GetGroceriesByStoreId(int storeId)
    {
        return _groceryRepository.GetAll().Where(g => g.StoreId == storeId);
    }

    public IEnumerable<Grocery> GetGroceriesByCategory(string categoryName)
    {
        return _groceryRepository.GetAll().Where(g => g.Categories.Any(c => c.Name == categoryName));
    }

    public IEnumerable<Grocery> GetGroceriesByStoreIdAndCategory(int storeId, string categoryName)
    {
        return _groceryRepository.GetAll()
            .Where(g => g.StoreId == storeId && g.Categories.Any(c => c.Name == categoryName));
    }

    public IEnumerable<Grocery> GetGroceriesByName(string name)
    {
        return _groceryRepository.GetAll().Where(g => g.Name == name);
    }

    public Grocery? GetGroceryById(int id)
    {
        return _groceryRepository.GetById(id);
    }

    public Grocery CreateGrocery(GroceryDTO groceryDto)
    {
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

        _groceryRepository.Create(grocery);
        return grocery;
    }

    public Grocery UpdateGrocery(int id, GroceryDTO groceryDto)
    {
        var existingGrocery = _groceryRepository.GetById(id);
        if (existingGrocery == null)
        {
            throw new KeyNotFoundException($"Grocery with ID {id} not found");
        }

        existingGrocery.Name = groceryDto.Name;
        existingGrocery.CurrentPrice = groceryDto.CurrentPrice;
        existingGrocery.OldPrice = groceryDto.OldPrice;
        existingGrocery.Quantity = groceryDto.Quantity;
        existingGrocery.ImageUrl = groceryDto.ImageUrl ?? string.Empty;
        existingGrocery.StoreId = groceryDto.StoreId;
        existingGrocery.CategoryId = groceryDto.CategoryId;

        _groceryRepository.Update(existingGrocery);
        return existingGrocery;
    }

    public void DeleteGrocery(int id)
    {
        var grocery = _groceryRepository.GetById(id);
        if (grocery == null)
        {
            throw new KeyNotFoundException($"Grocery with ID {id} not found");
        }

        _groceryRepository.Delete(grocery);
    }

    public bool StoreExists(int storeId)
    {
        return _storeRepository.GetById(storeId) != null;
    }

    public bool CategoryExists(int categoryId)
    {
        return _categoryRepository.GetById(categoryId) != null;
    }
}