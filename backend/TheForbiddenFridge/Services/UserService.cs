using TheForbiddenFridge.Repositories;
using TheForbiddenFridge.Models;
using TheForbiddenFridge.DTOs;

namespace TheForbiddenFridge.Services;

public class UserService(IUserRepository userRepository) : IUserService
{
    private readonly IUserRepository _userRepository = userRepository;

    public IEnumerable<User> GetAllUsers()
    {
        return _userRepository.GetAll();
    }

    public User? GetUserById(int id)
    {
        return _userRepository.GetById(id);
    }

    public User CreateUser(User user)
    {
        _userRepository.Create(user);
        return user;
    }

    public User UpdateUser(int id, User user)
    {
        var existingUser = _userRepository.GetById(id);
        if (existingUser == null)
        {
            throw new Exception("User not found");
        }

        existingUser.Username = user.Username;
        existingUser.Password = user.Password;
        existingUser.RoleId = user.RoleId;

        _userRepository.Update(existingUser);
        return existingUser;
    }

    public void DeleteUser(int id)
    {
        var existingUser = _userRepository.GetById(id);
        if (existingUser == null)
        {
            throw new Exception("User not found");
        }

        _userRepository.Delete(existingUser);
    }

    public List<UserInfoDTO> GetUserDTOInfo()
    {
        return _userRepository.GetUserInfoDTOs();
    }

}