 namespace Tests.Extensions
{
    public static class HttpClientExtensions
    {
        public static void UseBearer(this HttpClient client, string token)
        {
            if (client.DefaultRequestHeaders.Contains("Authorization"))
            {
                client.DefaultRequestHeaders.Remove("Authorization");
            }

            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");
        }
    }
}
