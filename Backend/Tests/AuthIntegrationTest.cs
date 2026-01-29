using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using TheForbiddenFridge.DTOs;

namespace Tests;

public class AuthIntegrationTest
{
    private readonly FridgeWebApplicationFactory _app;
    private readonly HttpClient _client;

    public AuthIntegrationTest()
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

    [Test]
    public async Task ProtectedEndpointWithNoAuthReturnsUnauthorized()
    {
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", string.Empty);
        var response = await _client.DeleteAsync("/api/store/1");
        Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.Unauthorized));
    }

    [Test]
    public async Task ProtectedEndpointWithAuthReturnsAuthorized()
    {
        var loginDto = new LoginDTO
        {
            Username = "admin",
            Password = "password"
        };
        var authResponse = await _client.PostAsync("/api/auth/login",
            JsonContent.Create(loginDto));
        Assert.That(authResponse.StatusCode, Is.EqualTo(HttpStatusCode.OK));

        var responseContent = await authResponse.Content.ReadAsStringAsync();
        var token = string.IsNullOrEmpty(responseContent) ? throw new Exception("Token response is empty") : responseContent.Trim('"');
        
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        var response = await _client.DeleteAsync("/api/store?id=1");
        Assert.That(response.StatusCode, Is.Not.EqualTo(HttpStatusCode.Unauthorized));
    }
}