using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using IdentityModel.Client;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using Shop.ApiResponses;

namespace Shop.Services
{
    public class ProductService : HttpService, IProductService
    {
        private const string ProductsEndpoint = "https://product-service.herokuapp.com/api/v1/products";

        public ProductService(HttpClient httpClient, IMemoryCache memoryCache) : base(httpClient, memoryCache)
        {
            _httpClient.SetBasicAuthentication("user", "pass");
        }

        public async Task<IEnumerable<ProductResponse>> GetAllProducts()
        {
            var cacheKey = nameof(GetAllProducts);

            if (!_memoryCache.TryGetValue(cacheKey, out string productJson))
            {
                var uriBuilder = new UriBuilder(ProductsEndpoint);

                var response = await _httpClient.GetAsync(uriBuilder.Uri);
                response.EnsureSuccessStatusCode();

                productJson = await response.Content.ReadAsStringAsync();

                _memoryCache.Set(cacheKey, productJson, _memoryCacheEntryOptions);
            }

            return JsonConvert.DeserializeObject<IEnumerable<ProductResponse>>(productJson);
        }

        public async Task<ProductResponse> GetProduct(string id)
        {
            var cacheKey = string.Join("{0}_{1}", nameof(GetProduct), id);

            if (!_memoryCache.TryGetValue(cacheKey, out string productJson))
            {
                var uriBuilder = new UriBuilder(ProductsEndpoint);
                uriBuilder.Path = Path.Combine(uriBuilder.Path, id);

                var response = await _httpClient.GetAsync(uriBuilder.Uri);
                response.EnsureSuccessStatusCode();

                productJson = await response.Content.ReadAsStringAsync();

                _memoryCache.Set(cacheKey, productJson, _memoryCacheEntryOptions);
            }

            return JsonConvert.DeserializeObject<ProductResponse>(productJson);
        }

        public async Task<bool> AreValidProductIds(IEnumerable<string> productIds)
        {
            productIds = productIds.Distinct();

            var allProducts = await GetAllProducts();

            var existingProductIds = allProducts.Select(p => p.Id);

            return existingProductIds.Intersect(productIds).Count() == productIds.Count();
        }
    }
}
