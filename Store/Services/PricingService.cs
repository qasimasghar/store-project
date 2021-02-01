using System;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Extensions;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using Shop.ApiResponses;
using Shop.Exceptions;

namespace Shop.Services
{
    public class PricingService : HttpService, IPricingService
    {
        private const string ExchangeRateApiUri = "https://api.exchangeratesapi.io/latest";

        public PricingService(HttpClient httpClient, IMemoryCache memoryCache) : base(httpClient, memoryCache)
        {
        }

        public async Task<double> ConvertCurrency(string from, string to, double amount)
        {
            from = from.ToUpper();
            to = to.ToUpper();

            if (from.Equals(to))
            {
                return amount;
            }

            var conversionRate = await GetConversionRate(from, to);

            return amount * conversionRate;;
        }

        private async Task<double> GetConversionRate(string from, string to)
        {
            var cacheKey = string.Join("{0}_{1}", nameof(GetConversionRate), from);

            if (!_memoryCache.TryGetValue(cacheKey, out string exchangeRateJson))
            {
                var queryBuilder = new QueryBuilder {{"base", from}};
                var uriBuilder = new UriBuilder(ExchangeRateApiUri) {Query = queryBuilder.ToString()};

                var response = await _httpClient.GetAsync(uriBuilder.Uri);
                response.EnsureSuccessStatusCode();

                exchangeRateJson = await response.Content.ReadAsStringAsync();

                _memoryCache.Set(cacheKey, exchangeRateJson, _memoryCacheEntryOptions);
            }

            var parsedJson = JsonConvert.DeserializeObject<ExchangeRateResponse>(exchangeRateJson);

            var currency = parsedJson.Rates.Keys.SingleOrDefault(r => r == to);

            if (currency == default || !parsedJson.Rates.TryGetValue(currency, out var exchangeRate))
            {
                throw new InvalidCurrencyException();
            }

            return exchangeRate;
        }
    }
}
