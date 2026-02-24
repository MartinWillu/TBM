using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using TheForbiddenFridge.Controllers;
using TheForbiddenFridge.Services;

public class UnitTestGrocery
{

    [Test]
    public async Task getGroceryByName()
    {
        var groceryServiceSub = Substitute.For<IGroceryService>();
        var groceryController = new GroceryController(groceryServiceSub);
        groceryServiceSub.GetGroceriesByName("Grocery").Returns(new List<TheForbiddenFridge.Models.Grocery>
    {
        new TheForbiddenFridge.Models.Grocery
        {
            Name = "Grocery",
            StoreId = 1,
            CategoryId = 1,
            OldPrice = 10.0f,
            CurrentPrice = 9.99f,
            ImageUrl = "http://example.com/grocery.png",
            Quantity = 100
        }
    });
        var result = groceryController.GetGroceriesByName("Grocery");
        Assert.That(result, Is.InstanceOf<OkObjectResult>());
    }


    [Test]
    public async Task getGroceriesByNameNotFound()
    {
        var groceryServiceSub = Substitute.For<IGroceryService>();
        var groceryController = new GroceryController(groceryServiceSub);
        groceryServiceSub.GetGroceriesByName("Nonexistent Grocery").Returns((IEnumerable<TheForbiddenFridge.Models.Grocery>)null);
        var result = groceryController.GetGroceriesByName("Nonexistent Grocery");
        Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task GetAllGroceries()
    {
        var groceryServiceSub = Substitute.For<IGroceryService>();
        var groceryController = new GroceryController(groceryServiceSub);
        groceryServiceSub.GetAllGroceries().Returns(new List<TheForbiddenFridge.Models.Grocery>
        {
        new TheForbiddenFridge.Models.Grocery
        {
            Name = "Grocery",
            StoreId = 1,
            CategoryId = 1,
            OldPrice = 10.0f,
            CurrentPrice = 9.99f,
            ImageUrl = "http://example.com/grocery.png",
            Quantity = 100
        }
       });
        var result = groceryController.GetAllGroceries();
        Assert.That(result, Is.InstanceOf<OkObjectResult>());
    }

    [Test]
    public async Task GetGroceryById()
    {
        var groceryServiceSub = Substitute.For<IGroceryService>();
        var groceryController = new GroceryController(groceryServiceSub);
        groceryServiceSub.GetGroceryById(1).Returns(new TheForbiddenFridge.Models.Grocery
        {
            Id = 1,
            Name = "Grocery",
            StoreId = 1,
            CategoryId = 1,
            OldPrice = 10.0f,
            CurrentPrice = 9.99f,
            ImageUrl = "http://example.com/grocery.png",
            Quantity = 100
        });
        var result = groceryController.GetGroceryById(1);
        Assert.That(result, Is.InstanceOf<OkObjectResult>());
    }


}