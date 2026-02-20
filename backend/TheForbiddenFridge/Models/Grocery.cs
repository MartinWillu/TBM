using System.ComponentModel.DataAnnotations;

namespace TheForbiddenFridge.Models;

public class Grocery
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; }
    public float CurrentPrice { get; set; }
    public float OldPrice { get; set; }
    public int Quantity { get; set; }

    [MaxLength(300)]
    public string ImageUrl { get; set; }

    public int StoreId { get; set; }
    public List<Store> Stores { get; set; }
    public int CategoryId { get; set; }
    public List<Category> Categories { get; set; }

    public Grocery()
    {
    }
}