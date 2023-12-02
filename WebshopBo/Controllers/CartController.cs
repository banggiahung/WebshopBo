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

namespace WebshopBo.Controllers
{
	public class CartController : Controller
	{
		private readonly ILogger<CartController> _logger;
		private readonly ApplicationDbContext _context;
		private readonly IConfiguration _configuration;
		private readonly ICommon _iCommon;
		private readonly IWebHostEnvironment _iHostingEnvironment;
		private readonly UserManager<ApplicationUser> _userManager;
		private readonly IWebHostEnvironment _env;
		public CartController(ILogger<CartController> logger, ApplicationDbContext context, IConfiguration configuration, ICommon common, IWebHostEnvironment iHostingEnvironment, UserManager<ApplicationUser> userManager, IWebHostEnvironment env)
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
		public IActionResult Success()
		{
			return View();
		
		}
		public IActionResult False()
		{
			return View();
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
                        decimal amount = 1982;
                        string returnUrl = _configuration["PaypalSettings:returnUrl"];
                        string cancelUrl = _configuration["PaypalSettings:cancelUrl"];

                        var createdPayment = await _iCommon.PaypalServices.CreateOrder(amount, returnUrl, cancelUrl);

                        string approvalUrl = createdPayment.links.FirstOrDefault(x => x.rel.ToLower() == "approval_url")?.href;

                        if (!string.IsNullOrEmpty(approvalUrl))
                        {
                          
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
        [HttpGet]
        public IActionResult GetCart()
        {
            try
            {
                ViewBag.userName = User.Identity.Name;
                var user = _context.ApplicationUser.Where(x => x.UserName == User.Identity.Name).FirstOrDefault();


                if (user != null)
                {
                    var vm = from a in _context.Orders
                             join b in _context.OrderDetails on a.OrderId equals b.OrderId
                             where a.Customer_Id == user.Id
                             where a.Order_Status == false
                             group new { a, b } by new { a.OrderId, a.Customer_Name, a.Customer_Id, a.Phone_Number, a.Address, a.CreateDate, a.Order_Status, a.Total_Price, b.ProductId, b.Product_Name, b.Product_Price, b.Product_Image } into g
                             select new
                             {
                                 OrderId = g.Key.OrderId,
                                 Customer_Name = g.Key.Customer_Name,
                                 Customer_Id = g.Key.Customer_Id,
                                 Phone_Number = g.Key.Phone_Number,
                                 Address = g.Key.Address,
                                 CreateDate = g.Key.CreateDate,
                                 Order_Status = g.Key.Order_Status,
                                 Total_Price = g.Key.Total_Price,
                                 Product_Name = g.Key.Product_Name,
                                 Product_Price = g.Key.Product_Price,
                                 Product_Quantity = g.Sum(x => x.b.Product_Quantity),
                                 Product_Image = g.Key.Product_Image,
                                 Product_Id = g.Key.ProductId
                             };

                    return Ok(vm.ToList());
                }
                else
                {
                    return NotFound();
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        //[HttpPost]
        [HttpPost]
		public async Task<IActionResult> AddToCart(OrdersCRUDViewModels model)
		{
			try
			{

				ViewBag.userName = User.Identity.Name;
				var user = _context.ApplicationUser.Where(x => x.UserName == User.Identity.Name).FirstOrDefault();
				if (user != null)
				{
					ViewBag.Name = user.FullName;
					var orderCheck = await _context.Orders.Where(x => x.Customer_Id == user.Id).OrderByDescending(o => o.CreateDate).FirstOrDefaultAsync();

					var product = await _context.Products.SingleOrDefaultAsync(p => p.ID == model.ProductIds);

					if (orderCheck != null)
					{
						if (orderCheck.Order_Status == true)
						{
							Orders nl = new Orders();

							if (user != null)
							{
								nl.Customer_Id = user.Id;
								nl.Customer_Name = user.UserName;
								nl.Phone_Number = user.PhoneNumber;
								nl.Address = user.Address;
								nl.Order_Status = false;
								nl.Total_Price = model.Product_Quantity * product.Price;
								nl.CreateDate = DateTime.Now;
							}
							_context.Orders.Add(nl);
							await _context.SaveChangesAsync();

							int orderId = nl.OrderId;

							OrderDetails _nl = new OrderDetails();
							_nl.Product_Name = product.ProductName;
							_nl.ProductId = product.ID;
							_nl.Product_Price = product.Price;
							_nl.Product_Quantity = model.Product_Quantity;
							_nl.Product_Image = product.ImageMain;
							_nl.Order_Id = orderId;
							_nl.OrderId = orderId;
							_context.Add(_nl);
							await _context.SaveChangesAsync();
						}
						else
						{
							int orderIdTrue = orderCheck.OrderId;
							int? checkQuan = model.Product_Quantity * product.Price;
							orderCheck.Total_Price += checkQuan;
							_context.Orders.Update(orderCheck);
							await _context.SaveChangesAsync();

							OrderDetails _nl = new OrderDetails();
							_nl.Product_Name = product.ProductName;
							_nl.ProductId = product.ID;
							_nl.Product_Price = product.Price;
							_nl.Product_Quantity = model.Product_Quantity;
							_nl.Product_Image = product.ImageMain;
							_nl.Order_Id = orderIdTrue;
							_nl.OrderId = orderIdTrue;
							_context.Add(_nl);
							await _context.SaveChangesAsync();
						}
					}
					else
					{
						Orders nl = new Orders();

						if (user != null)
						{
							nl.Customer_Id = user.Id;
							nl.Customer_Name = user.UserName;
							nl.Phone_Number = user.PhoneNumber;
							nl.Address = user.Address;
							nl.Order_Status = false;
							nl.Total_Price = model.Product_Quantity * product.Price;
							nl.CreateDate = DateTime.Now;
						}
						_context.Orders.Add(nl);
						await _context.SaveChangesAsync();

						int orderId = nl.OrderId;

						OrderDetails _nl = new OrderDetails();
						_nl.Product_Name = product.ProductName;
						_nl.ProductId = product.ID;
						_nl.Product_Price = product.Price;
						_nl.Product_Quantity = model.Product_Quantity;
						_nl.Product_Image = product.ImageMain;
						_nl.Order_Id = orderId;
						_nl.OrderId = orderId;
						_context.Add(_nl);
						await _context.SaveChangesAsync();

					}
					var options = new JsonSerializerOptions
					{
						ReferenceHandler = ReferenceHandler.Preserve
					};

					// Chuyển đối tượng model thành JSON
					var json = System.Text.Json.JsonSerializer.Serialize(model, options);

					// Trả về kết quả dưới dạng JsonResult
					return new JsonResult(json);
				}
				else
				{
					return Json(new { code = 400, mes = "Chưa đăng nhập" });
				}
			}
			catch (Exception ex)
			{
				return StatusCode(500, ex.Message);
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