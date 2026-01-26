using Microsoft.EntityFrameworkCore;

namespace TheForbiddenFridge.DbContexts;

public class FridgeDbContext(IConfiguration config) : DbContext
{
    /*
    DbSet<User> Users { get; set; }
    DbSet<Store>  Stores { get; set; }
    DbSet<Role>  Roles { get; set; }
    DbSet<Grocery>  Groceries { get; set; }
    DbSet<Category> Categories { get; set; }
    */
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        string databaseHost = config["DatabaseHost"] ?? "localhost";
        string databasePort = config["DatabasePort"] ?? "5432";
        
        string databaseName = config["DatabaseName"];
        
        string databaseUsername = config["DatabaseUsername"];
        string databasePassword = config["DatabasePassword"];
        string connString =
            $"Host={databaseHost};Port={databasePort};Username={databaseUsername};Password={databasePassword};Database={databaseName}";
        
        optionsBuilder.UseNpgsql(connString);
    }
}