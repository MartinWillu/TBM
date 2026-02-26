using System.Security.Claims;
using TheForbiddenFridge.Repositories;

namespace TheForbiddenFridge.Middleware;

public class RoleCheckMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context, IUserRepository userRepository)
    {
        if (context.User.Identity is { IsAuthenticated: true })
        {
            var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier) ?? context.User.FindFirst("sub");

            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out var userId))
            {
                var user = userRepository.GetById(userId);

                if (user == null)
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    context.Response.ContentType = "text/plain; charset=utf-8";
                    await context.Response.WriteAsync("User not found. Please login again.");
                    return;
                }

                var roleClaims = context.User.FindAll(ClaimTypes.Role)
                    .Select(c => c.Value)
                    .Concat(context.User.FindAll("role").Select(c => c.Value))
                    .Distinct()
                    .ToList();

                if (!roleClaims.Contains(user.Role.Name))
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    context.Response.ContentType = "text/plain; charset=utf-8";
                    await context.Response.WriteAsync("Role has changed. Please login again.");
                    return;
                }
            }
        }
        await next(context);
    }
}
