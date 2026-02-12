using System.ComponentModel.DataAnnotations;

namespace TheForbiddenFridge.DTOs;

public class GroceryDTO
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    [Required]
    [Range(0, float.MaxValue)]
    public float CurrentPrice { get; set; }

    [Range(0, float.MaxValue)]
    public float OldPrice { get; set; }

    [Required]
    [Range(0, int.MaxValue)]
    public int Quantity { get; set; }

    [MaxLength(300)]
    public string? ImageUrl { get; set; }

    [Required]
    public int StoreId { get; set; }

    [Required]
    public int CategoryId { get; set; }
}