using TheForbiddenFridge.Repositories;
using TheForbiddenFridge.Models;

namespace TheForbiddenFridge.Services;

public class CategoryService(
    ICategoryRepository categoryRepository) : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository = categoryRepository;

    public IEnumerable<Category> GetAllCategories()
    {
        return _categoryRepository.GetAll();
    }

    public Category? GetCategoryById(int id)
    {
        return _categoryRepository.GetById(id);
    }

    public Category CreateCategory(Category category)
    {
        var newCategory = new Category
        {
            Name = category.Name
        };

        _categoryRepository.Create(newCategory);
        return newCategory;
    }

    public Category UpdateCategory(int id, Category category)
    {
        var existingCategory = _categoryRepository.GetById(id);
        if (existingCategory == null)
        {
            throw new Exception("Category not found");
        }

        existingCategory.Name = category.Name;

        _categoryRepository.Update(existingCategory);
        return existingCategory;
    }

    public void DeleteCategory(int id)
    {
        var existingCategory = _categoryRepository.GetById(id);
        if (existingCategory == null)
        {
            throw new Exception("Category not found");
        }

        _categoryRepository.Delete(existingCategory);
    }
}