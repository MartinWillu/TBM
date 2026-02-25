using TheForbiddenFridge.Models;
using TheForbiddenFridge.DTOs;
namespace TheForbiddenFridge.Services;

public interface IUserService
{
    IEnumerable<User> GetAllUsers();
    User? GetUserById(int id);
    User RegisterUser(LoginDTO registerDTO);
    User? VerifyUser(LoginDTO loginDTO);
    User UpdateUser(int id, UserUpdateDTO updateDTO);
    User UpdateUser(int id, User user);
    void DeleteUser(int id);
    List<UserInfoDTO> GetUserDTOInfo();
}