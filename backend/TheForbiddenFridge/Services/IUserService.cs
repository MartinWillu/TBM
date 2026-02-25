using TheForbiddenFridge.Models;
using TheForbiddenFridge.DTOs;
namespace TheForbiddenFridge.Services;

public interface IUserService
{
    IEnumerable<User> GetAllUsers();
    User? GetUserById(int id);
    User CreateUser(User user);
    User UpdateUser(int id, User user);
    void DeleteUser(int id);
    List<UserInfoDTO> GetUserDTOById(int id);
}