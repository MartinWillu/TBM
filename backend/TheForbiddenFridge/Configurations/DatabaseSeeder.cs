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
        var adminPassword = _configuration["AdminPassword"] ?? "admin123";

        var users = new List<User>
        {
            new() {
                Username = "admin",
                Password = _cryptService.HashPassword(adminPassword),
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
                Name = "Rema 1000",
                LogoUrl = "https://www.pngkit.com/png/detail/358-3582531_rema-1000-logo.png",
                UserId = users[2].Id
            },
            new() {
                Name = "KIWI",
                LogoUrl = "https://www.eliteprosjekt.no/wp-content/uploads/2021/05/bunnpris-logo-digital-768x145.jpg",
                UserId = users[2].Id
            },
            new() {
                Name = "Bunnpris",
                LogoUrl = "https://www.eliteprosjekt.no/wp-content/uploads/2021/05/bunnpris-logo-digital-768x145.jpg",
                UserId = users[3].Id
            },
            new() {
                Name = "Coop Extra",
                LogoUrl = "https://tse3.mm.bing.net/th/id/OIP.bkP2KRhXtpo176lRB5Js4AHaEj?rs=1&pid=ImgDetMain&o=7&rm=3",
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
                ImageUrl = "https://tse2.mm.bing.net/th/id/OIP.AmcGlWm6tLVFs54C1qGNVgAAAA?rs=1&pid=ImgDetMain&o=7&rm=3",
                StoreId = stores[0].Id,
                CategoryId = categories[0].Id
            },
            new() {
                Name = "Bananas",
                CurrentPrice = 1.99f,
                OldPrice = 2.49f,
                Quantity = 150,
                ImageUrl = "https://static.fanpage.it/wp-content/uploads/sites/22/2018/06/istock-162487071.jpg",
                StoreId = stores[0].Id,
                CategoryId = categories[0].Id
            },
            new() {
                Name = "Whole Milk",
                CurrentPrice = 3.49f,
                OldPrice = 3.99f,
                Quantity = 50,
                ImageUrl = "https://tse4.mm.bing.net/th/id/OIP.Yrabrg2WnCHzaEVSHWIs-gHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
                StoreId = stores[0].Id,
                CategoryId = categories[2].Id
            },
            new() {
                Name = "Cheddar Cheese",
                CurrentPrice = 5.99f,
                OldPrice = 6.99f,
                Quantity = 30,
                ImageUrl = "https://bilder.ngdata.no/5000295080836/meny/large.jpg",
                StoreId = stores[0].Id,
                CategoryId = categories[2].Id
            },
            new() {
                Name = "Fresh Carrots",
                CurrentPrice = 2.49f,
                OldPrice = 2.99f,
                Quantity = 80,
                ImageUrl = "https://tse1.mm.bing.net/th/id/OIP.NQoblU6aVDk4w-pjm_mqRgHaGD?rs=1&pid=ImgDetMain&o=7&rm=3",
                StoreId = stores[1].Id,
                CategoryId = categories[1].Id
            },
            new() {
                Name = "Broccoli",
                CurrentPrice = 2.99f,
                OldPrice = 3.49f,
                Quantity = 60,
                ImageUrl = "https://bilder.ngdata.no/4349/meny/large.jpg",
                StoreId = stores[1].Id,
                CategoryId = categories[1].Id
            },
            new() {
                Name = "Strawberries",
                CurrentPrice = 4.99f,
                OldPrice = 5.99f,
                Quantity = 40,
                ImageUrl = "https://tse1.mm.bing.net/th/id/OIP.KD5TiA6k_Ug8SWjYmxQ4ZgHaIr?rs=1&pid=ImgDetMain&o=7&rm=3",
                StoreId = stores[1].Id,
                CategoryId = categories[0].Id
            },
            new() {
                Name = "Chicken Breast",
                CurrentPrice = 7.99f,
                OldPrice = 9.99f,
                Quantity = 25,
                ImageUrl = "https://images.eatthismuch.com/site_media/img/451_erin_m_d7cfcfcd-642a-4d6b-b6e8-0adf3eabbff7.png",
                StoreId = stores[2].Id,
                CategoryId = categories[3].Id
            },
            new() {
                Name = "Ground Beef",
                CurrentPrice = 5.99f,
                OldPrice = 7.49f,
                Quantity = 35,
                ImageUrl = "https://tse2.mm.bing.net/th/id/OIP.SbO9dFhscf7bSdo8kPe_0gHaFf?rs=1&pid=ImgDetMain&o=7&rm=3",
                StoreId = stores[2].Id,
                CategoryId = categories[3].Id
            },
            new() {
                Name = "Orange Juice",
                CurrentPrice = 4.49f,
                OldPrice = 5.49f,
                Quantity = 45,
                ImageUrl = "https://tse4.mm.bing.net/th/id/OIP.HRGD_yir6cfz5uXgldOizQHaHa?rs=1&pid=ImgDetMain&o=7&rm=3",
                StoreId = stores[2].Id,
                CategoryId = categories[4].Id
            },
            new() {
                Name = "Whole Wheat Bread",
                CurrentPrice = 3.99f,
                OldPrice = 4.49f,
                Quantity = 55,
                ImageUrl = "https://bilder.ngdata.no/9108/meny/large.jpg",
                StoreId = stores[3].Id,
                CategoryId = categories[5].Id
            },
            new() {
                Name = "Croissants",
                CurrentPrice = 5.99f,
                OldPrice = 6.99f,
                Quantity = 20,
                ImageUrl = "https://th.bing.com/th/id/R.273af4f1b013443c7730003b8a980a95?rik=qDCmug3OR0%2fhcw&riu=http%3a%2f%2fepicureandculture.com%2fwp-content%2fuploads%2f2014%2f12%2fshutterstock_172040546.jpg&ehk=INlZHKFggsSlVC7GWhz9LSsU3xMP1uXGKb%2fhu76DsWg%3d&risl=&pid=ImgRaw&r=0",
                StoreId = stores[3].Id,
                CategoryId = categories[5].Id
            },
            new() {
                Name = "Organic Granola Bars",
                CurrentPrice = 4.49f,
                OldPrice = 5.49f,
                Quantity = 100,
                ImageUrl = "https://i.ebayimg.com/images/g/fcIAAeSwUUZpgKPJ/s-l1600.webp",
                StoreId = stores[3].Id,
                CategoryId = categories[6].Id
            },
            new() {
                Name = "Frozen Pizza",
                CurrentPrice = 6.99f,
                OldPrice = 8.99f,
                Quantity = 30,
                ImageUrl = "https://bilder.ngdata.no/4001724039112/meny/large.jpg",
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