namespace TheForbiddenFridge.Models;

public class Role
{
    public int Id { get; set; }
    public string Name { get; set; }

    public int UserId { get; set; }
    public User User { get; set; }

    public Role()
    {
        
    }
}