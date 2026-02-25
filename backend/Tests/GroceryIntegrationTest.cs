using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using Tests.Extensions;
using TheForbiddenFridge.DbContexts;
using TheForbiddenFridge.DTOs;
using TheForbiddenFridge.Models;

namespace Tests;

public class GroceryIntegrationTest
{
    private readonly FridgeWebApplicationFactory _app;
    private readonly HttpClient _client;

    public GroceryIntegrationTest()
    {
        _app = new FridgeWebApplicationFactory();
        _client = _app.CreateClient();
    }

    [OneTimeTearDown]
    public void OneTimeTearDown()
    {
        _app.Dispose();
        _client.Dispose();
    }
    
    
    
    private (int storeId, int categoryId) EnsureStoreAndCategory()
    {
        using var scope = _app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<FridgeDbContext>();

        // Store: set ALL required props
        var store = db.Stores.FirstOrDefault();
        if (store is null)
        {
            store = new Store
            {
                Name = "Test Store",
                LogoUrl = "https://example.com/logo.png", 
                
            };
            db.Stores.Add(store);
        }

        // Category: set any required props
        var category = db.Categories.FirstOrDefault();
        if (category is null)
        {
            category = new Category { Name = "Test Category" };
            db.Categories.Add(category);
        }

        db.SaveChanges();
        return (store.Id, category.Id);
    }


    
    [Test]
    public async Task CreateGrocery_MissingName_ReturnsBadRequest()
    {
        var jwt = await TestAuthHelper.GetJwtAsync(_client);
        _client.UseBearer(jwt);

        var (storeId, categoryId) = EnsureStoreAndCategory();

        var invalid = new GroceryDTO
        {
            Name = null,           // missing on purpose
            CurrentPrice = 12.5f, 
            Quantity = 1,         
            StoreId = storeId,     
            CategoryId = categoryId
        };

        var response = await _client.PostAsJsonAsync("/api/grocery", invalid);
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

        var body = await response.Content.ReadAsStringAsync();
        body.Should().ContainAny("Name", "name"); // validation message hint
    }
}