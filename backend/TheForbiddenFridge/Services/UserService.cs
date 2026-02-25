using TheForbiddenFridge.Service;
using TheForbiddenFridge.Repositories;
using TheForbiddenFridge.Models;
using TheForbiddenFridge.DTOs;

namespace TheForbiddenFridge.Services;

public class UserService(IUserRepository userRepository, CryptService cryptService) : IUserService
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly CryptService _cryptService = cryptService;

    public IEnumerable<User> GetAllUsers()
    {
        return _userRepository.GetAll();
    }

    public User? GetUserById(int id)
    {
        return _userRepository.GetById(id);
    }

    public User RegisterUser(LoginDTO registerDTO)
    {
        if (registerDTO.Username != null)
        {
            registerDTO.Username = registerDTO.Username.Trim();
        }

        if (registerDTO.Password != null)
        {
            registerDTO.Password = registerDTO.Password.Trim();
        }

        if (string.IsNullOrWhiteSpace(registerDTO.Username) || registerDTO.Username.Length < 3)
        {
            throw new ArgumentException("Username must be at least 3 characters long.");
        }

        if (string.IsNullOrWhiteSpace(registerDTO.Password) || registerDTO.Password.Length < 6)
        {
            throw new ArgumentException("Password must be at least 6 characters long.");
        }

        if (_userRepository.GetAll().Any(user => user.Username == registerDTO.Username))
        {
            throw new ArgumentException("Username already exists");
        }

        string hashedPassword = _cryptService.HashPassword(registerDTO.Password);

        var user = new User(registerDTO.Username, hashedPassword)
        {
            Role = new Role { Name = "User" }
        };

        _userRepository.Create(user);
        return user;
    }

    public User? VerifyUser(LoginDTO loginDTO)
    {
        var user = _userRepository.GetAll().FirstOrDefault(user => user.Username == loginDTO.Username);
        if (user == null)
        {
            return null;
        }

        bool verified = _cryptService.VerifyPassword(loginDTO.Password, user.Password);
        if (!verified)
        {
            return null;
        }

        // Remove hashedPassword on return
        user.Password = "";
        return user;
    }

    public User UpdateUser(int id, UserUpdateDTO updateDTO)
    {
        var existingUser = _userRepository.GetById(id);
        if (existingUser == null)
        {
            throw new Exception("User not found");
        }

        updateDTO.Username = updateDTO.Username?.Trim();
        updateDTO.Password = updateDTO.Password?.Trim();

        if (updateDTO.Username != null)
        {
            updateDTO.Username = updateDTO.Username.Trim();
            if (string.IsNullOrWhiteSpace(updateDTO.Username) || updateDTO.Username.Length < 3)
            {
                throw new ArgumentException("Username must be at least 3 characters long.");
            }

            if (_userRepository.GetAll().Any(u => u.Username == updateDTO.Username && u.Id != id))
            {
                throw new ArgumentException("Username already exists.");
            }

            existingUser.Username = updateDTO.Username;
        }

        if (updateDTO.Password != null)
        {
            updateDTO.Password = updateDTO.Password.Trim();
            if (string.IsNullOrWhiteSpace(updateDTO.Password) || updateDTO.Password.Length < 6)
            {
                throw new ArgumentException("Password must be at least 6 characters long.");
            }
            existingUser.Password = _cryptService.HashPassword(updateDTO.Password);
        }

        _userRepository.Update(existingUser);
        return existingUser;
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