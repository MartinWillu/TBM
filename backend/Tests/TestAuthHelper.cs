using System.Net.Http.Json;
using TheForbiddenFridge.DTOs;

public static class TestAuthHelper
{
    public static async Task<string> GetJwtAsync(HttpClient client)
    {
        var loginDto = new LoginDTO
        {
            Username = "admin",
            Password = "password"
        };

        var response = await client.PostAsJsonAsync("/api/auth/login", loginDto);

        if (!response.IsSuccessStatusCode)
        {
            var body = await response.Content.ReadAsStringAsync();
            throw new Exception($"Failed to authenticate admin. Status: {response.StatusCode}\n{body}");
        }

        var raw = await response.Content.ReadAsStringAsync();
        return raw.Trim('"');
    }
}