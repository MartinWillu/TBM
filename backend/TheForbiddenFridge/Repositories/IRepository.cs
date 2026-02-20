namespace TheForbiddenFridge.Repositories;

public interface IRepository<T, in TK>
{
    void Create(T user);
    void Update(T user);
    void Delete(T user);
    T? GetById(TK id);
    IEnumerable<T> GetAll();
}