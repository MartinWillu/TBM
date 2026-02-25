using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using NUnit.Framework;
using Tests.Extensions; // UseBearer + TestAuthHelper
using TheForbiddenFridge.DTOs;



namespace Tests;

public class StoreIntegrationTest
{
    private readonly HttpClient _client;
    private FridgeWebApplicationFactory _app;
     
    public StoreIntegrationTest()
    {
        _app = new FridgeWebApplicationFactory();
        _client = _app.CreateClient(new WebApplicationFactoryClientOptions
        {
            BaseAddress = new Uri("https://localhost:5001")
        });
        // _client.BaseAddress = new Uri("https://localhost");
    }

    [OneTimeTearDown]
    public void OneTimeTearDown()
    {
        _app.Dispose();
        _client.Dispose();
    }

    private sealed class StoreCreated
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? LogoUrl { get; set; }
    }

    [Test]
    public async Task Create_Then_Delete_Then_Get_ReturnNotFound()
    {
        var jwt = await TestAuthHelper.GetJwtAsync(_client);
        Console.WriteLine("JWT Token: " + jwt);
        _client.UseBearer(jwt);

        var dto = new StoreDTO
        {
            Name = "test store",
            LogoUrl = "https://example.com/logo.png"
        };

        // Send POST request to create a store
        var create = await _client.PostAsJsonAsync("/api/store", dto);
        
        // debug lines
        Console.WriteLine($"POST status: {(int)create.StatusCode} {create.StatusCode}");
        Console.WriteLine($"Redirect Location: {create.Headers.Location}");
        
        if (!create.IsSuccessStatusCode)
        {
            var bodyCreate = await create.Content.ReadAsStringAsync();
            Assert.Fail($"POST /api/store failed: {(int)create.StatusCode} {create.StatusCode}\n{bodyCreate}");
        }

        create.StatusCode.Should().BeOneOf(HttpStatusCode.Created, HttpStatusCode.OK);
        
        var created = await create.Content.ReadFromJsonAsync<StoreCreated>();
        created.Should().NotBeNull("the API should return the created store");
        created.Id.Should().BeGreaterThan(-1, "the created store should have a valid ID");
        
        // Trying to delete store with the ID from the created store
        var delete = await _client.DeleteAsync($"/api/store/{created.Id}");
        if (!delete.IsSuccessStatusCode)
        {
            var bodyDelete = await delete.Content.ReadAsStringAsync();
            Assert.Fail($"DELETE /api/store?id={created.Id} failed: {(int)delete.StatusCode} {delete.StatusCode}\n{bodyDelete}");
        }

        delete.StatusCode.Should().Be(HttpStatusCode.NoContent);
        
        var get = await _client.GetAsync($"/api/store/{created.Id}");
        get.StatusCode.Should().Be(HttpStatusCode.NotFound);
        
        // Store should be deleted
        var body = await get.Content.ReadAsStringAsync();
        body.Should().Contain("Store not found");
    }
}