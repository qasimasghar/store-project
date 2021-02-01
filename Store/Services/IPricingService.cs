using System.Threading.Tasks;

namespace Shop.Services
{
    public interface IPricingService
    {
        Task<double> ConvertCurrency(string from, string to, double amount);
    }
}
