using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using TheForbiddenFridge.Controllers;
using TheForbiddenFridge.DTOs;
using TheForbiddenFridge.Services;
using TheForbiddenFridge.Repositories;
using TheForbiddenFridge.Models;
public class UnitTestStore
{


    [Test]
    public async Task GetStoreById()
    {
        var storeSub = Substitute.For<IStoreRepository>();
        var storeController = new StoreController(storeSub);
        storeSub.GetById(1).Returns(new TheForbiddenFridge.Models.Store { Id = 1, Name = "Rema 1000", LogoUrl = "http://example.com/logo.png" });
        var result = storeController.GetById(1);
        Assert.That(result, Is.InstanceOf<OkObjectResult>());
    }


    [Test]
    public async Task GetStoreByIdNotFound()
    {
        var storeSub = Substitute.For<IStoreRepository>();
        var storeController = new StoreController(storeSub);
        storeSub.GetById(1).Returns(null as TheForbiddenFridge.Models.Store);
        var result = storeController.GetById(1);
        Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
    }
}
