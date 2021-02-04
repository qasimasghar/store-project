using System.Threading.Tasks;
using Shop.BindingModels;
using Shop.Models;

namespace Shop.ModelMapper
{
    public interface IPackageMapper
    {
        Task<PackageBindingModel> ModelToBindingModel(Package package, string currency);

        Package BindingModelToModel(PackageBindingModel packageBindingModel);
    }
}
