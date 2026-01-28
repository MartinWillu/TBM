using TheForbiddenFridge.DbContexts;
using TheForbiddenFridge.Models;

namespace TheForbiddenFridge.Repositories;

public class CategoryRepository(FridgeDbContext context) : ICategoryRepository
{
    public void Create(Category category)
    {
       context.Add(category);
       context.SaveChanges();
    }
    
    public void Update(Category category)
    {
        context.Update(category);
        context.SaveChanges();
    }
    
    public void Delete(Category category)
    {
        context.Remove(category);
        context.SaveChanges();
    }
    
    public Category? GetById(int id)
    {
        return context.Categories.FirstOrDefault(category => category.Id == id);
    }
    
    public IEnumerable<Category> GetAll()
    {
        return context.Categories;
    }
}

/*
 * public class GroceryRepository(FridgeDbContext context) : IGroceryRepository
{
    public void Create(Grocery grocery)
    {
        context.Add(grocery);
        context.SaveChanges();
    }
    
    public void Update(Grocery grocery)
    {
        context.Update(grocery);
        context.SaveChanges();
    }
    
    public void Delete(Grocery grocery)
    {
        context.Remove(grocery);
        context.SaveChanges();
    }
    
    public Grocery? GetById(int id)
    {
        return context.Groceries.FirstOrDefault(grocery => grocery.Id == id);
    }
    
    public IEnumerable<Grocery> GetAll()
    {
        return context.Groceries;
    }
}
 */