using PayPal.Api;

namespace WebshopBo.Services
{
    public interface IPayPal
    {
        Task<Payment> CreateOrder(decimal price, string returnUrl, string cancelUrl);

    }
}
