using TheForbiddenFridge.Models;

namespace TheForbiddenFridge.Repositories;

public interface IRoleRepository : IRepository<Role, int>
{
    Role? GetRoleByName(string name);
}