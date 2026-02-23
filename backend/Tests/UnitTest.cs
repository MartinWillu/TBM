using System.Net;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using TheForbiddenFridge.Controllers;
using TheForbiddenFridge.DTOs;
using TheForbiddenFridge.Services;

using TheForbiddenFridge.Repositories;


public class UnitTest
{


    [Test]
    public async Task TestGetStoreById()
    {

        var storeSub = Substitute.For<IStoreRepository>();
        var storeController = new StoreController(storeSub);
        var store = storeController.Create(new StoreDTO
        {
            Name = "Test Store",
            LogoUrl = "http://example.com/logo.png",
        });


        var result = storeController.GetById(1);
        Assert.That(result, Is.InstanceOf<OkObjectResult>());
    }


    [Test]
    public async Task CreateStore()
    {
        var storeSub = Substitute.For<IStoreRepository>();
        var storeController = new StoreController(storeSub);
        var storeDTO = new StoreDTO
        {
            Name = "Test Store",
            LogoUrl = "http://example.com/logo.png",
        };
        var result = storeController.Create(storeDTO);
        Assert.That(result, Is.InstanceOf<CreatedAtActionResult>());
    }


    [Test]
    public async Task CreateStoreWithInvalidData()
    {
        var storeSub = Substitute.For<IStoreRepository>();
        var storeController = new StoreController(storeSub);
        var storeDTO = new StoreDTO
        {
            Name = null!,
            LogoUrl = "http://example.com/logo.png",
        };
        storeController.ModelState.AddModelError("Name", "Name is required");
        var result = storeController.Create(storeDTO);
        Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
    }


    [Test]
    public async Task GetStoreByIdNotFound()
    {
        var storeSub = Substitute.For<IStoreRepository>();
        var storeController = new StoreController(storeSub);
        var result = storeController.GetById(999);
        Assert.That(result, Is.InstanceOf<NotFoundResult>());
    }


    [Test]
    public async Task getGroceryByName()
    {
        var groceryServiceSub = Substitute.For<IGroceryService>();
        var groceryController = new GroceryController(groceryServiceSub);

        var grocery = groceryController.CreateGrocery(new GroceryDTO
        {
            Name = "Test Grocery",
            CurrentPrice = 9.99f,
            OldPrice = 12.99f,
            Quantity = 100,
            StoreId = 1,
            CategoryId = 1,
            ImageUrl = "http://example.com/grocery.png"
        });

        var result = groceryController.GetGroceryByName("Test Grocery");
        Assert.That(result, Is.InstanceOf<OkObjectResult>());
    }


    [Test]
    public async Task getGroceryByNameNotFound()
    {
        var groceryServiceSub = Substitute.For<IGroceryService>();
        var groceryController = new GroceryController(groceryServiceSub);

        var result = groceryController.GetGroceryByName("Nonexistent Grocery");
        Assert.That(result, Is.InstanceOf<NotFoundResult>());
    }


    [Test]
    public async Task CreateGroceryWithInvalidData()
    {
        var groceryServiceSub = Substitute.For<IGroceryService>();
        var groceryController = new GroceryController(groceryServiceSub);

        var groceryDTO = new GroceryDTO
        {
            Name = null!,
            CurrentPrice = 9.99f,
            OldPrice = 12.99f,
            Quantity = 100,
            StoreId = 1,
            CategoryId = 1,
            ImageUrl = "http://example.com/grocery.png"
        };
        groceryController.ModelState.AddModelError("Name", "Name is required");
        var result = groceryController.CreateGrocery(groceryDTO);
        Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
    }


    [Test]
    public async Task CreateCathegory()
    {
        var categorySub = Substitute.For<ICategoryRepository>();
        var categoryController = new CategoryController(categorySub);
        var categoryDTO = new CategoryDTO
        {
            Name = "Test Category"
        };
        var result = categoryController.Create(categoryDTO);
        Assert.That(result, Is.InstanceOf<OkObjectResult>());
    }


    [Test]
    public async Task CreateCategoryWithInvalidData()
    {
        var categorySub = Substitute.For<ICategoryRepository>();
        var categoryController = new CategoryController(categorySub);
        var categoryDTO = new CategoryDTO
        {
            Name = null!
        };
        categoryController.ModelState.AddModelError("Name", "Name is required");
        var result = categoryController.Create(categoryDTO);
        Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
    }


    [Test]
    public async Task GetCategoryById()
    {
        var categorySub = Substitute.For<ICategoryRepository>();
        var categoryController = new CategoryController(categorySub);
        var category = categoryController.Create(new CategoryDTO
        {
            Name = "Test Category"
        });

        var result = categoryController.GetById(1);
        Assert.That(result, Is.InstanceOf<OkObjectResult>());
    }
}