namespace TheForbiddenFridge.Models;

public class Grocery
{
    public int Id { get; set; }
    public string Name { get; set; }
    public float CurrentPrice { get; set; }
    public float OldPrice { get; set; }
    public int Quantity { get; set; } // changed from "Amount" to "Quantity"
    public int StoreId { get; set; }
    public int CategoryId { get; set; }

    public List<Store> Stores { get; set; }
    public List<Category> Categories { get; set; }
    
    public Grocery()
    {
    }
}
