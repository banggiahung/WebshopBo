using Microsoft.Extensions.Configuration;
using PayPal.Api;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace WebshopBo.Services
{
    public class PayPal : IPayPal
    {
        private readonly IConfiguration _configuration;
        private readonly APIContext _apiContext;

        public PayPal(IConfiguration configuration)
        {
            _configuration = configuration;
            var clientId = _configuration["PaypalSettings:ClientId"];
            var secret = _configuration["PaypalSettings:Secret"];

            var config = new Dictionary<string, string>
            {
                { "mode", "sandbox" },
                { "clientId", clientId },
                { "clientSecret", secret },
            };

            var accessToken = new OAuthTokenCredential(clientId, secret, config).GetAccessToken();
            _apiContext = new APIContext(accessToken);
        }

        public async Task<Payment> CreateOrder(decimal amount, string returnUrl, string cancelUrl)
        {
            var itemList = new ItemList()
            {
                items = new List<Item>()
                {
                    new Item()
                    {
                        name = "Item Name comes here",
                        currency = "USD",
                        price = "100",
                        quantity = "1",
                        sku = "sku"
                    }
                }
            };

            var transaction = new Transaction()
            {
                amount = new Amount()
                {
                    currency = "USD",
                    total = "100",
                    details = new Details()
                    {
                        subtotal = "100"
                    }
                },
                item_list = itemList,
                description = "Membership Fee",
            };

            var payment = new Payment()
            {
                intent = "sale",
                payer = new Payer() { payment_method = "paypal" },
                redirect_urls = new RedirectUrls()
                {
                    return_url = returnUrl,
                    cancel_url = cancelUrl,
                },
                transactions = new List<Transaction> { transaction }
            };

            var createPayment =  payment.Create(_apiContext);
            return createPayment;
        }
    }
}
