using TheForbiddenFridge.DbContexts;
using TheForbiddenFridge.Models;
using TheForbiddenFridge.Service;

namespace TheForbiddenFridge.Services;

public class DatabaseSeeder
{
    private readonly FridgeDbContext _context;
    private readonly CryptService _cryptService;
    private readonly IConfiguration _configuration;

    public DatabaseSeeder(FridgeDbContext context, CryptService cryptService, IConfiguration configuration)
    {
        _context = context;
        _cryptService = cryptService;
        _configuration = configuration;
    }

    public async Task SeedAsync()
    {
        var shouldSeed = _configuration["CreateSeedData"];
        if (shouldSeed != "true")
        {
            return;
        }

        await _context.Database.EnsureCreatedAsync();
        if (_context.Roles.Any())
        {
            Console.WriteLine("Database already contains seed data. Skipping seeding.");
            return;
        }

        Console.WriteLine("Seeding database with sample data...");

        var roles = new List<Role>
        {
            new() { Name = "Admin" },
            new() { Name = "User" },
            new() { Name = "StoreOwner" }
        };
        await _context.Roles.AddRangeAsync(roles);
        await _context.SaveChangesAsync();

        // Seed Users
        var users = new List<User>
        {
            new() {
                Username = "admin",
                Password = _cryptService.HashPassword("admin123"),
                RoleId = roles[0].Id
            },
            new() {
                Username = "john_doe",
                Password = _cryptService.HashPassword("password123"),
                RoleId = roles[1].Id
            },
            new() {
                Username = "store_owner1",
                Password = _cryptService.HashPassword("owner123"),
                RoleId = roles[2].Id
            },
            new() {
                Username = "store_owner2",
                Password = _cryptService.HashPassword("owner456"),
                RoleId = roles[2].Id
            }
        };
        await _context.Users.AddRangeAsync(users);
        await _context.SaveChangesAsync();

        var categories = new List<Category>
        {
            new() { Name = "Fruits" },
            new() { Name = "Vegetables" },
            new() { Name = "Dairy" },
            new() { Name = "Meat" },
            new() { Name = "Beverages" },
            new() { Name = "Bakery" },
            new() { Name = "Snacks" },
            new() { Name = "Frozen Foods" }
        };
        await _context.Categories.AddRangeAsync(categories);
        await _context.SaveChangesAsync();

        var stores = new List<Store>
        {
            new() {
                Name = "Fresh Market",
                LogoUrl = "https://example.com/logos/fresh-market.png",
                UserId = users[2].Id
            },
            new() {
                Name = "Green Grocers",
                LogoUrl = "https://example.com/logos/green-grocers.png",
                UserId = users[2].Id
            },
            new() {
                Name = "Super Saver",
                LogoUrl = "https://example.com/logos/super-saver.png",
                UserId = users[3].Id
            },
            new() {
                Name = "Organic Corner",
                LogoUrl = "https://example.com/logos/organic-corner.png",
                UserId = users[3].Id
            }
        };
        await _context.Stores.AddRangeAsync(stores);
        await _context.SaveChangesAsync();

        var groceries = new List<Grocery>
        {
            new() {
                Name = "Organic Apples",
                CurrentPrice = 3.99f,
                OldPrice = 4.99f,
                Quantity = 100,
                ImageUrl = "https://example.com/images/apples.jpg",
                StoreId = stores[0].Id,
                CategoryId = categories[0].Id
            },
            new() {
                Name = "Bananas",
                CurrentPrice = 1.99f,
                OldPrice = 2.49f,
                Quantity = 150,
                ImageUrl = "https://example.com/images/bananas.jpg",
                StoreId = stores[0].Id,
                CategoryId = categories[0].Id
            },
            new() {
                Name = "Whole Milk",
                CurrentPrice = 3.49f,
                OldPrice = 3.99f,
                Quantity = 50,
                ImageUrl = "https://example.com/images/milk.jpg",
                StoreId = stores[0].Id,
                CategoryId = categories[2].Id
            },
            new() {
                Name = "Cheddar Cheese",
                CurrentPrice = 5.99f,
                OldPrice = 6.99f,
                Quantity = 30,
                ImageUrl = "https://example.com/images/cheese.jpg",
                StoreId = stores[0].Id,
                CategoryId = categories[2].Id
            },
            new() {
                Name = "Fresh Carrots",
                CurrentPrice = 2.49f,
                OldPrice = 2.99f,
                Quantity = 80,
                ImageUrl = "https://example.com/images/carrots.jpg",
                StoreId = stores[1].Id,
                CategoryId = categories[1].Id
            },
            new() {
                Name = "Broccoli",
                CurrentPrice = 2.99f,
                OldPrice = 3.49f,
                Quantity = 60,
                ImageUrl = "https://example.com/images/broccoli.jpg",
                StoreId = stores[1].Id,
                CategoryId = categories[1].Id
            },
            new() {
                Name = "Strawberries",
                CurrentPrice = 4.99f,
                OldPrice = 5.99f,
                Quantity = 40,
                ImageUrl = "https://example.com/images/strawberries.jpg",
                StoreId = stores[1].Id,
                CategoryId = categories[0].Id
            },
            new() {
                Name = "Chicken Breast",
                CurrentPrice = 7.99f,
                OldPrice = 9.99f,
                Quantity = 25,
                ImageUrl = "https://example.com/images/chicken.jpg",
                StoreId = stores[2].Id,
                CategoryId = categories[3].Id
            },
            new() {
                Name = "Ground Beef",
                CurrentPrice = 5.99f,
                OldPrice = 7.49f,
                Quantity = 35,
                ImageUrl = "https://example.com/images/beef.jpg",
                StoreId = stores[2].Id,
                CategoryId = categories[3].Id
            },
            new() {
                Name = "Orange Juice",
                CurrentPrice = 4.49f,
                OldPrice = 5.49f,
                Quantity = 45,
                ImageUrl = "https://example.com/images/oj.jpg",
                StoreId = stores[2].Id,
                CategoryId = categories[4].Id
            },
            new() {
                Name = "Whole Wheat Bread",
                CurrentPrice = 3.99f,
                OldPrice = 4.49f,
                Quantity = 55,
                ImageUrl = "https://example.com/images/bread.jpg",
                StoreId = stores[3].Id,
                CategoryId = categories[5].Id
            },
            new() {
                Name = "Croissants",
                CurrentPrice = 5.99f,
                OldPrice = 6.99f,
                Quantity = 20,
                ImageUrl = "https://example.com/images/croissants.jpg",
                StoreId = stores[3].Id,
                CategoryId = categories[5].Id
            },
            new() {
                Name = "Organic Granola Bars",
                CurrentPrice = 4.49f,
                OldPrice = 5.49f,
                Quantity = 100,
                ImageUrl = "https://example.com/images/granola.jpg",
                StoreId = stores[3].Id,
                CategoryId = categories[6].Id
            },
            new() {
                Name = "Frozen Pizza",
                CurrentPrice = 6.99f,
                OldPrice = 8.99f,
                Quantity = 30,
                ImageUrl = "https://example.com/images/pizza.jpg",
                StoreId = stores[2].Id,
                CategoryId = categories[7].Id
            }
        };
        await _context.Groceries.AddRangeAsync(groceries);
        await _context.SaveChangesAsync();

        Console.WriteLine("Database seeding completed successfully!");
        Console.WriteLine($"- {roles.Count} roles");
        Console.WriteLine($"- {users.Count} users");
        Console.WriteLine($"- {categories.Count} categories");
        Console.WriteLine($"- {stores.Count} stores");
        Console.WriteLine($"- {groceries.Count} groceries");
    }
}