using Microsoft.EntityFrameworkCore;
using TheForbiddenFridge.DbContexts;
using TheForbiddenFridge.DTOs;
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
        return fridgeDbContext.Users.Include(u => u.Role).FirstOrDefault(u => u.Id == id);
    }

    public IEnumerable<User> GetAll()
    {
        return fridgeDbContext.Users.Include(u => u.Role);
    }

    public List<UserInfoDTO> GetUserInfoDTOs()
    {
        return [.. GetAll().Select(user => new UserInfoDTO() { Id = user.Id, Role = user.Role.Name, Username = user.Username })];
    }
}