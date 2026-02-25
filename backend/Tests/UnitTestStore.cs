using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using TheForbiddenFridge.Controllers;
using TheForbiddenFridge.Services;

public class UnitTestStore
{


    [Test]
    public async Task GetStoreById()
    {
        var storeSub = Substitute.For<IStoreService>();
        var storeController = new StoreController(storeSub);
        storeSub.GetStoreById(1).Returns(new TheForbiddenFridge.Models.Store { Id = 1, Name = "Rema 1000", LogoUrl = "http://example.com/logo.png" });
        var result = storeController.GetById(1);
        Assert.That(result, Is.InstanceOf<OkObjectResult>());
    }


    [Test]
    public async Task GetStoreByIdNotFound()
    {
        var storeSub = Substitute.For<IStoreService>();
        var storeController = new StoreController(storeSub);
        storeSub.GetStoreById(1).Returns(null as TheForbiddenFridge.Models.Store);
        var result = storeController.GetById(1);
        Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
    }
}
