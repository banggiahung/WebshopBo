using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ShopWebCustomer.Models.OrdersViewModels;
using System.Diagnostics;
using System.Text.Json.Serialization;
using System.Text.Json;
using WebshopBo.Data;
using WebshopBo.Models;
using WebshopBo.Models.ViewHome;
using WebshopBo.Services;
using PayPal.Api;

namespace WebshopBo.Controllers
{
    public class CheckoutController : Controller
    {
        private readonly ILogger<CartController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ICommon _iCommon;
        private readonly IWebHostEnvironment _iHostingEnvironment;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _env;



        public double TyGiaUsd = 23300;
        public CheckoutController(ILogger<CartController> logger, ApplicationDbContext context, IConfiguration configuration, ICommon common, IWebHostEnvironment iHostingEnvironment, UserManager<ApplicationUser> userManager, IWebHostEnvironment env)
        {
            _logger = logger;
            _context = context;
            _configuration = configuration;
            _iCommon = common;
            _iHostingEnvironment = iHostingEnvironment;
            _userManager = userManager;
            _env = env;
        }

        public IActionResult Index()
        {
            ViewBag.userName = User.Identity.Name;
            var user = _context.ApplicationUser.FirstOrDefault(x => x.UserName == User.Identity.Name);

            if (user != null)
            {
                ViewBag.Email = user.Email;
                var order = _context.Orders
                    .Where(a => a.Customer_Id == user.Id && a.Order_Status == false)
                    .Include(x => x.OrderDetailsList)
                    .FirstOrDefault();

                if (order != null)
                {
                    var groupedOrderDetails = order.OrderDetailsList
                        .GroupBy(od => od.ProductId)
                        .Select(group => new OrderDetails
                        {
                            ProductId = group.Key,
                            Product_Name = group.First().Product_Name,
                            Product_Price = group.First().Product_Price,
                            Product_Quantity = group.Sum(x => x.Product_Quantity),
                            Product_Image = group.First().Product_Image,
                            OrderId = group.First().OrderId // Nếu bạn cần OrderId, bạn có thể lấy giá trị đầu tiên từ nhóm
                        })
                        .ToList();

                    order.OrderDetailsList = groupedOrderDetails;

                    var item = new ListViewHomeCRUD
                    {
                        OrderMain = order
                    };

                    return View(item);
                }
                else
                {
                    return NotFound();
                }
            }
            else
            {
                return NotFound();
            }
        }

        [HttpPost]
        public async Task<IActionResult> ComfirmOrder(int? orderId)
        {
            try
            {
                if (orderId != null)
                {
                    Orders find = await _context.Orders.FirstOrDefaultAsync(x => x.OrderId == orderId);
                    if (find != null)
                    {

                        find.Order_Status = true;
                        _context.Orders.Update(find);
                        await _context.SaveChangesAsync();
                        return Ok(find);
                    }
                    else
                    {
                        return NotFound();

                    }

                }
                else
                {
                    return NotFound();

                }
            }
            catch (Exception ex)
            {
                return BadRequest("Lỗi: " + ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> TestPaypal(int? orderId)
        {
            try
            {

                if (orderId != null)
                {
                    Orders find = await _context.Orders.FirstOrDefaultAsync(x => x.OrderId == orderId);
                    if (find != null)
                    {
                        decimal amount = (decimal)find.Total_Price;
                        string returnUrl = "/Home/Index";
                        string cancelUrl = "/Home/Index";

                        var createdPayment = await _iCommon.PaypalServices.CreateOrder(amount, returnUrl, cancelUrl);

                        string approvalUrl = createdPayment.links.FirstOrDefault(x => x.rel.ToLower() == "approval_url")?.href;

                        if(!string.IsNullOrEmpty(approvalUrl))
                        {
                            find.Order_Status = true;
                            _context.Orders.Update(find);
                            await _context.SaveChangesAsync();
                            return Redirect(approvalUrl);
                        }
                        else
                        {
                            TempData["error"] = " Lỗi giao dịch";
                        }
                       
                    }
                    else
                    {
                        return NotFound();

                    }

                }
                else
                {
                    return NotFound();

                }
                return NotFound();

            }
            catch (Exception ex)
            {
                return BadRequest("Lỗi: " + ex.Message);
            }
        }

        public IActionResult Privacy()
        {
            return View();
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}