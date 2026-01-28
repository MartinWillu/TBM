namespace TheForbiddenFridge.Models;

public class User
{
    public int Id { get; set; }
    public string Username {get; set;}
    public string Password {get; set;}
    
    public int RoleId {get; set;}
    public Role Role {get; set;}
    
    public List<Store> Stores {get; set;}

    public User()
    {
        
    }
}