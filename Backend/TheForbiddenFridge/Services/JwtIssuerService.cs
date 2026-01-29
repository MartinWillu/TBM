using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace TheForbiddenFridge.Service;

public class JwtIssuerService
{
    private readonly string _jwtKey;
    private readonly string _jwtIssuer;
    private readonly string _jwtAudience;
    
    private const int JwtValidMinutes = 120;

    public JwtIssuerService(IConfiguration config)
    {
        _jwtKey = config["JwtKey"] ?? throw new ArgumentNullException("JwtKey");
        _jwtIssuer = config["JwtIssuer"] ?? throw new ArgumentNullException("JwtIssuer");
        _jwtAudience = config["JwtAudience"] ?? throw new ArgumentNullException("JwtAudience");
    }

    public string CreateJwt(string userId, string username, List<string> roles)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, userId),
            new Claim(JwtRegisteredClaimNames.Name, username),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
        };
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_jwtKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _jwtIssuer,
            audience: _jwtAudience,
            claims: claims,
            expires: DateTime.Now.AddMinutes(JwtValidMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}