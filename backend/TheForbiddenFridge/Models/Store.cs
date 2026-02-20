using System.ComponentModel.DataAnnotations;

namespace TheForbiddenFridge.Models;

public class Store
{
    public int Id { get; set; }

    [Required]
    [MaxLength(120)]
    public string Name { get; set; }

    [MaxLength(300)]
    public string LogoUrl { get; set; }

    public List<Grocery> Groceries { get; set; }

    public int GroceryId { get; set; }

    public int UserId { get; set; }

    public Store()
    {
    }
}