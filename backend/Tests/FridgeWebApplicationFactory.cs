using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TheForbiddenFridge.DbContexts;
using TheForbiddenFridge.Models;
using TheForbiddenFridge.Service;

namespace Tests;

public class FridgeWebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = Guid.NewGuid().ToString();

    public FridgeWebApplicationFactory()
    {
        Environment.SetEnvironmentVariable("DatabaseName", _dbName);
        Environment.SetEnvironmentVariable("Jwt__Secret", "epic-secret-key-for-testing-that-is-long-enough");
        Environment.SetEnvironmentVariable("Jwt__Issuer", "TestIssuer");
        Environment.SetEnvironmentVariable("Jwt__Audience", "TestAudience");
    }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration((context, config) =>
        {
            config.AddEnvironmentVariables();
        });
        builder.ConfigureServices(services =>
        {
            //Get the previous DbContext registration 
            var fridgeWatchDbContextDescriptor =
                services.SingleOrDefault(d => d.ServiceType == typeof(FridgeDbContext));
            if (fridgeWatchDbContextDescriptor == null)
            {
                throw new Exception("The DbContext was not found!");
            }

            //Remove the previous DbContextOptions registration
            services.Remove(fridgeWatchDbContextDescriptor);
            services.AddDbContext<FridgeDbContext>(options => { options.UseInMemoryDatabase(_dbName); });

            //Since DbContexts are scoped services, we create a scope
            using var scope = services.BuildServiceProvider().CreateScope();

            //We use this scope to request the registered dbcontext, and initialize the schemas
            var fridgeContext = scope.ServiceProvider.GetRequiredService<FridgeDbContext>();
            fridgeContext.Database.EnsureDeleted();
            fridgeContext.Database.EnsureCreated();

            //Here we could do more initializing if we wished (e.g. adding admin user)
            var passwordHasher = scope.ServiceProvider.GetRequiredService<CryptService>();
            var hashedPassword = passwordHasher.HashPassword("password");
            
            var adminRole = new Role { Name = "Admin" };
            var adminUser = new User("admin", hashedPassword) { Role = adminRole, Id = 1 }; // Explicitly set the admin user's ID

            fridgeContext.Roles.Add(adminRole);
            fridgeContext.Users.Add(adminUser);
            fridgeContext.SaveChanges();
        });
    }
}