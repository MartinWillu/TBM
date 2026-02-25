using FluentAssertions;
using NUnit.Framework;

namespace Tests;

[TestFixture]
public class FluentAssertionsTest
{
    [Test]
    public void FluentAssertions_Should_Work()
    {
        // Arrange
        var actual = "Hello, FluentAssertions!";

        // Act & Assert
        actual.Should().NotBeNullOrEmpty();
        actual.Should().Contain("FluentAssertions");
    }
}
