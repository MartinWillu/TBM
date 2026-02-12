using System.ComponentModel.DataAnnotations;

namespace TheForbiddenFridge.DTOs;

public class StoreDTO
{
    [Required]
    [MaxLength(120)]
    public string Name { get; set; }

    [MaxLength(300)]
    public string? LogoUrl { get; set; }
}