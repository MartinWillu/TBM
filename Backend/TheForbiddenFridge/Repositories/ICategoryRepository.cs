using TheForbiddenFridge.Models;

namespace TheForbiddenFridge.Repositories;

public interface ICategoryRepository
{
    public interface ICategoryRepository : IRepository<Category, int>
    {
    }
}

