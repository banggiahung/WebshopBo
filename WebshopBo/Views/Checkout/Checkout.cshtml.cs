using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace WebshopBo.Views.Checkout
{
    public class CheckoutModel : PageModel
    {
        public string PaypalClientID { get; set; } = " ";
        public string PaypalSecret { get; set; } = " ";
        public string PaypalUrl { get; set; } = " ";  
        
        public string DeliveryAddress { get; set; } = " ";
        public string Total { get; set; } = " ";
        public string ProductIdentifiers { get; set; } = " ";
        public CheckoutModel(IConfiguration configuration)
        {
            PaypalClientID = configuration["PaypalSettings:ClientId"]!;
            PaypalSecret = configuration["PaypalSettings:Secret"]!;
            PaypalUrl = configuration["PaypalSettings:Url"]!;

        }
        public void OnGet()
        {
            DeliveryAddress = "test";
            Total = "189";
            ProductIdentifiers = "3";
        }
    }
}
