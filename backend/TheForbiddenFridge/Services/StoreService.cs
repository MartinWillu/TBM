using TheForbiddenFridge.Models;
using TheForbiddenFridge.DTOs;
using TheForbiddenFridge.Repositories;

namespace TheForbiddenFridge.Services;

public class StoreService(
    IStoreRepository storeRepository,
    IGroceryRepository groceryRepository) : IStoreService
{
    private readonly IStoreRepository _storeRepository = storeRepository;
    private readonly IGroceryRepository _groceryRepository = groceryRepository;

    public IEnumerable<Store> GetAllStores()
    {
        return _storeRepository.GetAll();
    }

    public Store? GetStoreById(int id)
    {
        return _storeRepository.GetById(id);
    }

    public Store CreateStore(Store store)
    {
        _storeRepository.Create(store);
        return store;
    }

    public Store UpdateStore(int id, StoreDTO storeDto)
    {
        var existingStore = _storeRepository.GetById(id);
        if (existingStore == null)
        {
            throw new Exception("Store not found");
        }

        existingStore.Name = storeDto.Name;
        existingStore.LogoUrl = storeDto.LogoUrl ?? string.Empty;

        _storeRepository.Update(existingStore);
        return existingStore;
    }

    public void DeleteStore(int id)
    {
        var existingStore = _storeRepository.GetById(id);
        if (existingStore == null)
        {
            throw new Exception("Store not found");
        }

        // Delete associated groceries first
        var groceriesToDelete = _groceryRepository.GetAll().Where(g => g.StoreId == id).ToList();
        foreach (var grocery in groceriesToDelete)
        {
            _groceryRepository.Delete(grocery);
        }

        _storeRepository.Delete(existingStore);
    }

    public bool UserOwnsStore(int storeId, int userId)
    {
        var store = _storeRepository.GetById(storeId);
        return store != null && store.UserId == userId;
    }
}