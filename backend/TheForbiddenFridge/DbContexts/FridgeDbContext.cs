using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using TheForbiddenFridge.Models;

namespace TheForbiddenFridge.DbContexts;

public class FridgeDbContext(IConfiguration config, DbContextOptions<FridgeDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }

    public DbSet<Store> Stores { get; set; }
    public DbSet<Grocery> Groceries { get; set; }

    public DbSet<Category> Categories { get; set; }


    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        if (optionsBuilder.IsConfigured)
        {
            return;
        }
        var databaseName = config["DatabaseName"] ?? throw new Exception("Missing environment variable DatabaseUsername");
        var databaseHost = config["DatabaseHost"] ?? "localhost";
        var databasePort = config["DatabasePort"] ?? "5432";
        var databaseUsername = config["DatabaseUsername"] ?? throw new Exception("Missing environment variable DatabaseUsername");
        var databasePassword = config["DatabasePassword"] ?? throw new Exception("Missing environment variable DatabasePassword");
        var connString =
            $"Host={databaseHost};Port={databasePort};Username={databaseUsername};Password={databasePassword};Database={databaseName}";
        Console.WriteLine(connString);
        optionsBuilder.UseNpgsql(connString);
        optionsBuilder.ConfigureWarnings(w =>
            w.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
    }
}