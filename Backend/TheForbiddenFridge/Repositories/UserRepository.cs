using TheForbiddenFridge.DbContexts;
using TheForbiddenFridge.Models;

namespace TheForbiddenFridge.Repositories;

public class UserRepository(FridgeDbContext fridgeDbContext) : IUserRepository
{
    public void Create(User user)
    {
        fridgeDbContext.Add(user);
        fridgeDbContext.SaveChanges();
    }

    public void Update(User user)
    {
        fridgeDbContext.Update(user);
        fridgeDbContext.SaveChanges();
    }

    public void Delete(User user)
    {
        fridgeDbContext.Remove(user);
        fridgeDbContext.SaveChanges();
    }

    public User? GetById(int id)
    {
        return fridgeDbContext.Find<User>(id);
    }

    public IEnumerable<User> GetAll()
    {
        return fridgeDbContext.Users;
    }
}