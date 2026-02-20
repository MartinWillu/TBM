using Microsoft.EntityFrameworkCore;
using TheForbiddenFridge.DbContexts;
using TheForbiddenFridge.Models;

namespace TheForbiddenFridge.Repositories;


public class StoreRepository(FridgeDbContext context) : IStoreRepository
{
    public void Create(Store store)
    {
       context.Add(store);
       context.SaveChanges();
    }

    public void Update(Store store)
    {
        context.Update(store);
        context.SaveChanges();
    }

    public void Delete(Store store)
    {
        context.Remove(store);
        context.SaveChanges();
    }

    public Store? GetById(int id)
    {
        return context.Stores.FirstOrDefault(store => store.Id == id);
    }

    public IEnumerable<Store> GetAll()
    {
        return context.Stores;
    }
}