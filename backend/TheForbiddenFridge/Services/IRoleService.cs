using TheForbiddenFridge.Repositories;
using TheForbiddenFridge.Models;
namespace TheForbiddenFridge.Services;


public interface IRoleService
{
    IEnumerable<Role> GetAllRoles();
    Role? GetRoleById(int id);
    Role CreateRole(Role role);
    Role UpdateRole(int id, Role role);
    void DeleteRole(int id);
    Role? GetRoleByName(string name);
}