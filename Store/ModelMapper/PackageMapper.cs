using System;
using System.Linq;
using System.Threading.Tasks;
using Shop.BindingModels;
using Shop.Models;
using Shop.Services;

namespace Shop.ModelMapper
{
    public class PackageMapper : IPackageMapper
    {
        private readonly IPricingService _pricingService;
        private readonly IProductService _productService;

        public PackageMapper(IPricingService pricingService, IProductService productService)
        {
            _pricingService = pricingService;
            _productService = productService;
        }

        public async Task<PackageBindingModel> ModelToBindingModel(Package package, string currency)
        {
            var price = await _pricingService.ConvertCurrency("USD", currency, package.UsdPrice);

            return new PackageBindingModel
            {
                Id = package.Id,
                Name = package.Name,
                Description = package.Description,
                Products = package.Products.Split(','),
                Price = Math.Round(price / 100, 2)
            };
        }

        public Package BindingModelToModel(PackageBindingModel packageBindingModel)
        {
            return new Package
            {
                Id = packageBindingModel.Id,
                Name = packageBindingModel.Name,
                Description = packageBindingModel.Description,
                Products = string.Join(',', packageBindingModel.Products.Distinct()),
            };
        }
    }
}
