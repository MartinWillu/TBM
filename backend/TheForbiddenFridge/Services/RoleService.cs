using TheForbiddenFridge.Repositories;
using TheForbiddenFridge.Models;
namespace TheForbiddenFridge.Services;

public class RoleService(IRoleRepository roleRepository) : IRoleService
{
    private readonly IRoleRepository _roleRepository = roleRepository;

    public IEnumerable<Role> GetAllRoles()
    {
        return _roleRepository.GetAll();
    }

    public Role? GetRoleById(int id)
    {
        return _roleRepository.GetById(id);
    }

    public Role CreateRole(Role role)
    {
        _roleRepository.Create(role);
        return role;
    }

    public Role UpdateRole(int id, Role role)
    {
        var existingRole = _roleRepository.GetById(id);
        if (existingRole == null)
        {
            throw new Exception("Role not found");
        }

        existingRole.Name = role.Name;

        _roleRepository.Update(existingRole);
        return existingRole;
    }

    public void DeleteRole(int id)
    {
        var existingRole = _roleRepository.GetById(id);
        if (existingRole == null)
        {
            throw new Exception("Role not found");
        }

        _roleRepository.Delete(existingRole);
    }

    public Role? GetRoleByName(string name)
    {
        return _roleRepository.GetRoleByName(name);
    }
}