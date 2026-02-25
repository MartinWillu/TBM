using TheForbiddenFridge.Models;
using TheForbiddenFridge.DTOs;

namespace TheForbiddenFridge.Services;

public interface IStoreService
{
    IEnumerable<Store> GetAllStores();
    Store? GetStoreById(int id);
    Store CreateStore(Store store);
    Store UpdateStore(int id, StoreDTO storeDto);
    void DeleteStore(int id);
    bool UserOwnsStore(int storeId, int userId);
}