using TheForbiddenFridge.Models;

namespace TheForbiddenFridge.Repositories;

public interface IGroceryRepository
{
    public interface IGroceryRepository : IRepository<Grocery, int>
    {
    }
}
