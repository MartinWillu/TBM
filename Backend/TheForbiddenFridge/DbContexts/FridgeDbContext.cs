using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TheForbiddenFridge.Models;

namespace TheForbiddenFridge.DbContexts;

public class FridgeDbContext(IConfiguration config) : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Role>  Roles { get; set; }
    
    public DbSet<Store>  Stores { get; set; }
    public DbSet<Grocery>  Groceries { get; set; }
    /*
    DbSet<Category> Categories { get; set; }
    */
    
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var databaseHost = config["DatabaseHost"] ?? "localhost";
        var databasePort = config["DatabasePort"] ?? "5432";
        
        var databaseName = config["DatabaseName"];
        
        var databaseUsername = config["DatabaseUsername"];
        var databasePassword = config["DatabasePassword"];
        var connString =
            $"Host={databaseHost};Port={databasePort};Username={databaseUsername};Password={databasePassword};Database={databaseName}";
        
        optionsBuilder.UseNpgsql(connString);
    }
}