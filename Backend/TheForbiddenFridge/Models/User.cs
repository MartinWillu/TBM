using System.ComponentModel.DataAnnotations;

namespace TheForbiddenFridge.Models;

public class User
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Username { get; set; }

    [Required]
    [MaxLength(255)]
    public string Password { get; set; }

    public int RoleId { get; set; }
    public Role Role { get; set; }

    public List<Store> Stores { get; set; }

    public User(string username, string password)
    {
        Username = username;
        Password = password;
    }

    public User()
    {
    }
}