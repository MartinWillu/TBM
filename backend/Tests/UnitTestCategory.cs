using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using TheForbiddenFridge.Controllers;
using TheForbiddenFridge.DTOs;
using TheForbiddenFridge.Services;
using TheForbiddenFridge.Repositories;
using TheForbiddenFridge.Models;
public class UnitTestCategory
{
    [Test]
    public async Task CreateCategoryWithInvalidData()
    {
        var categorySub = Substitute.For<ICategoryRepository>();
        var categoryController = new CategoryController(categorySub);
        var categoryDTO = new CategoryDTO { Name = "" };
        var result = categoryController.Create(categoryDTO);
        Assert.That(result, Is.InstanceOf<BadRequestObjectResult>());
    }

    //DONE
    [Test]
    public async Task CreateCategory()
    {
        var categorySub = Substitute.For<ICategoryRepository>();
        var categoryController = new CategoryController(categorySub);
        var categoryDTO = new CategoryDTO { Name = "Test Category" };
        var result = categoryController.Create(categoryDTO);
        Assert.That(result, Is.InstanceOf<OkObjectResult>());
    }

    //DONE
    [Test]
    public async Task GetCategoryById()
    {
        var categorySub = Substitute.For<ICategoryRepository>();
        categorySub.GetById(1).Returns(new TheForbiddenFridge.Models.Category
        {
            Id = 1,
            Name = "Test Category"
        });

        var categoryController = new CategoryController(categorySub);

        var result = categoryController.GetById(1);
        Assert.That(result, Is.InstanceOf<OkObjectResult>());
    }

    [Test]
    public async Task DeleteCategory()
    {
        var categorySub = Substitute.For<ICategoryRepository>();
        var categoryController = new CategoryController(categorySub);
        categorySub.GetById(1).Returns(new TheForbiddenFridge.Models.Category
        {
            Id = 1,
            Name = "Test Category"
        });

        var result = categoryController.Delete(1);
        Assert.That(result, Is.InstanceOf<OkObjectResult>());
    }

}