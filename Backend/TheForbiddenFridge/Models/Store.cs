namespace TheForbiddenFridge.Models;

public class Store
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string LogoUrl { get; set; }

    public List<Grocery> Groceries { get; set; }
    
    public int GroceryId { get; set; }

    public Store()
    {
        
    }
}