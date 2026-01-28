namespace TheForbiddenFridge.Models;

public class Category
{
    public int Id { get; set; }
    public string Name { get; set; }
    
    public List<Grocery> Groceries { get; set; }
    public int GroceryId { get; set; }

    public Category()
    {
    }
}
