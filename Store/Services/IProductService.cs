using System.Collections.Generic;
using System.Threading.Tasks;
using Shop.ApiResponses;

namespace Shop.Services
{
    public interface IProductService
    {
        Task<IEnumerable<ProductResponse>> GetAllProducts();

        Task<ProductResponse> GetProduct(string id);

        Task<bool> AreValidProductIds(IEnumerable<string> productIds);

    }
}
