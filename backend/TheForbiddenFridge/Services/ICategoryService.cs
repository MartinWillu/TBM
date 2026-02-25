using TheForbiddenFridge.Repositories;
using TheForbiddenFridge.Models;
namespace TheForbiddenFridge.Services;

public interface ICategoryService
{
    IEnumerable<Category> GetAllCategories();
    Category? GetCategoryById(int id);
    Category CreateCategory(Category category);
    Category UpdateCategory(int id, Category category);
    void DeleteCategory(int id);
}