using TheForbiddenFridge.DTOs;
using TheForbiddenFridge.Models;

namespace TheForbiddenFridge.Services;

public interface IGroceryService
{
    IEnumerable<Grocery> GetAllGroceries();
    IEnumerable<Grocery> GetGroceriesByStoreId(int storeId);
    IEnumerable<Grocery> GetGroceriesByCategory(string categoryName);
    IEnumerable<Grocery> GetGroceriesByStoreIdAndCategory(int storeId, string categoryName);
    IEnumerable<Grocery> GetGroceriesByName(string name);
    Grocery? GetGroceryById(int id);
    Grocery CreateGrocery(GroceryDTO groceryDto);
    Grocery UpdateGrocery(int id, GroceryDTO groceryDto);
    void DeleteGrocery(int id);
    bool StoreExists(int storeId);
    bool CategoryExists(int categoryId);
}