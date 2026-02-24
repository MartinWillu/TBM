using TheForbiddenFridge.DTOs;
using TheForbiddenFridge.Models;

namespace TheForbiddenFridge.Repositories;

public interface IUserRepository : IRepository<User, int>
{
    List<UserInfoDTO> GetUserInfoDTOs();
}