using System.ComponentModel.DataAnnotations;

public class CategoryDTO
{
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }
}