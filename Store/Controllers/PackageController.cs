using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shop.BindingModels;
using Shop.Data;
using Shop.Exceptions;
using Shop.ModelMapper;
using Shop.Models;
using Shop.Services;

namespace Shop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackageController : Controller
    {
        private readonly IPackageMapper _packageMapper;
        private readonly IPricingService _pricingService;
        private readonly IProductService _productService;

        public PackageController(ApplicationDbContext dbContext, IPackageMapper packageMapper, IPricingService pricingService, IProductService productService) : base(dbContext)
        {
            DbContext = dbContext;
            _productService = productService;
            _pricingService = pricingService;
            _packageMapper = packageMapper;
        }

        [HttpGet]
        public async Task<IActionResult> ListPackages(string currency = "USD")
        {
            var mappedPackages = new List<PackageBindingModel>();

            foreach (var package in DbContext.Package)
            {
                mappedPackages.Add(await _packageMapper.ModelToBindingModel(package, currency));
            }

            return new OkObjectResult(mappedPackages);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> RetrievePackage(int id, string currency = "USD")
        {
            var package = DbContext.Package.SingleOrDefault(p => p.Id == id);

            if (package == default)
            {
                return NotFound();
            }

            return new OkObjectResult(await _packageMapper.ModelToBindingModel(package, currency));
        }

        [HttpPost]
        public async Task<IActionResult> CreatePackage(PackageBindingModel packageBindingModel, string currency = "USD")
        {
            var package = await PreparePackage(packageBindingModel, currency);

            package.Id = 0;

            DbContext.Add(package);
            await DbContext.SaveChangesAsync();

            return new AcceptedResult();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePackage(int id, PackageBindingModel packageBindingModel, string currency = "USD")
        {
            if (!DbContext.Package.Any(p => p.Id == id))
            {
                return NotFound();
            }

            var package = await PreparePackage(packageBindingModel, currency);

            package.Id = id;

            DbContext.Entry(package).State = EntityState.Modified;
            await DbContext.SaveChangesAsync();

            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePackage(int id)
        {
            var package = DbContext.Package.SingleOrDefault(p => p.Id == id);

            if (package == default)
            {
                return NotFound();
            }

            DbContext.Remove(package);
            await DbContext.SaveChangesAsync();

            return new NoContentResult();
        }

        private async Task<Package> PreparePackage(PackageBindingModel packageBindingModel, string currency)
        {
            var areValidProductIds = await _productService.AreValidProductIds(packageBindingModel.Products);

            if (!areValidProductIds)
            {
                throw new InvalidProductsException();
            }

            var products = (await _productService.GetAllProducts())
                .Where(p => packageBindingModel.Products.Contains(p.Id));

            var package = _packageMapper.BindingModelToModel(packageBindingModel);

            package.UsdPrice = await _pricingService.ConvertCurrency(currency, "USD", products.Sum(p => p.UsdPrice));

            return package;
        }
    }
}
