using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using TheForbiddenFridge.Configurations;
using TheForbiddenFridge.DbContexts;
using TheForbiddenFridge.Repositories;
using TheForbiddenFridge.Service;
using TheForbiddenFridge.Services;

var builder = WebApplication.CreateBuilder(args);

var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtSettings = jwtSection.Get<JwtSettings>() ?? throw new InvalidOperationException("JWT settings not found in configuration");
builder.Services.Configure<JwtSettings>(jwtSection);

builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    }
).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters()
    {
        ValidIssuer = jwtSettings.Issuer,
        ValidAudience = jwtSettings.Audience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings.Secret)),
    };
});


builder.Services.AddAuthorizationBuilder()
    .AddPolicy("User",
        new AuthorizationPolicyBuilder().AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
            .RequireAuthenticatedUser().Build())
    .AddPolicy("Admin",
        new AuthorizationPolicyBuilder().AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
            .RequireAuthenticatedUser().Build())
    .AddPolicy("StoreOwner",
        new AuthorizationPolicyBuilder().AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
            .RequireAuthenticatedUser().Build());

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddDbContext<FridgeDbContext>();

builder.Services.AddScoped<JwtIssuerService>();
builder.Services.AddScoped<CryptService>();
builder.Services.AddScoped<DatabaseSeeder>();
builder.Services.AddScoped<IGroceryService, GroceryService>();

builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IGroceryRepository, GroceryRepository>();
builder.Services.AddScoped<IStoreRepository, StoreRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

var app = builder.Build();

// Seed the database!
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DatabaseSeeder>();
    await seeder.SeedAsync();
}

app.UseAuthentication();
app.UseAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();