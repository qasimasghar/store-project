using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Shop.BindingModels;
using Shop.Data;
using Shop.ModelMapper;
using Shop.Models;
using Shop.Services;

namespace Shop.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PackageController : BaseController
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
            var areValidProductIds = await _productService.AreValidProductIds(packageBindingModel.Products);

            if (!areValidProductIds)
            {
                return BadRequest();
            }

            var products = (await _productService.GetAllProducts())
                .Where(p => packageBindingModel.Products.Contains(p.Id));

            var package = await _packageMapper.BindingModelToModel(packageBindingModel, currency);

            package.Id = 0;
            package.UsdPrice = await _pricingService.ConvertCurrency(currency, "USD", products.Sum(p => p.UsdPrice));

            DbContext.Add(package);
            await DbContext.SaveChangesAsync();

            return new AcceptedResult();
        }

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePackage(int id, PackageBindingModel packageBindingModel, string currency = "USD")
        {
            var package = await _packageMapper.BindingModelToModel(packageBindingModel, currency);
            package.Id = id;

            DbContext.Entry(package).State = EntityState.Modified;
            await DbContext.SaveChangesAsync();

            return new NoContentResult();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeletePackage(Package package)
        {
            DbContext.Remove(package);
            await DbContext.SaveChangesAsync();

            return new NoContentResult();
        }
    }
}
