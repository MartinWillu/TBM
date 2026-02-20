using System.ComponentModel.DataAnnotations;

namespace TheForbiddenFridge.Models;

public class Role
{
    public int Id { get; set; }

    [Required]
    [MaxLength(50)]
    public string Name { get; set; }

    public ICollection<User> Users { get; set; } = new List<User>();

    public Role()
    {
    }
}