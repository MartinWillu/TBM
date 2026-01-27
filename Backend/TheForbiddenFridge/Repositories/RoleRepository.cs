using TheForbiddenFridge.DbContexts;
using TheForbiddenFridge.Models;

namespace TheForbiddenFridge.Repositories;

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