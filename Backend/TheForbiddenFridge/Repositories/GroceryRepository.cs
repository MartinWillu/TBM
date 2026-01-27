using TheForbiddenFridge.DbContexts;
using TheForbiddenFridge.Models;

namespace TheForbiddenFridge.Repositories;

public class GroceryRepository(FridgeDbContext context) : IGroceryRepository
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

/*
public class RoleRepository(FridgeDbContext context) : IRoleRepository
{
    public void Create(Role user)
    {   
        context.Roles.Add(user);
        context.SaveChanges();
    }

    public void Update(Role user)
    {
        context.Roles.Update(user);
        context.SaveChanges();
    }

    public void Delete(Role user)
    {
        context.Roles.Remove(user);
        context.SaveChanges();
    }

    public Role? GetById(int id)
    {
        return context.Roles.FirstOrDefault(role => role.Id == id );
    }

    public IEnumerable<Role> GetAll()
    {
        return context.Roles;
    }
} 
 
 */