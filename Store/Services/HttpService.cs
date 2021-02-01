using System;
using System.Net.Http;
using Microsoft.Extensions.Caching.Memory;

namespace Shop.Services
{
    public abstract class HttpService
    {
        protected readonly HttpClient _httpClient;
        protected readonly IMemoryCache _memoryCache;
        protected readonly MemoryCacheEntryOptions _memoryCacheEntryOptions;

        protected HttpService(HttpClient httpClient, IMemoryCache memoryCache)
        {
            _httpClient = httpClient;
            _memoryCache = memoryCache;
            _memoryCacheEntryOptions = new MemoryCacheEntryOptions()
                .SetSlidingExpiration(TimeSpan.FromMinutes(5));
        }
    }
}
