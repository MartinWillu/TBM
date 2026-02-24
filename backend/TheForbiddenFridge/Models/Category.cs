using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace TheForbiddenFridge.Models;

public class Category
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100), NotNull]
    public string Name { get; set; }

    public List<Grocery> Groceries { get; set; }
    public int GroceryId { get; set; }

    public Category()
    {
    }
}