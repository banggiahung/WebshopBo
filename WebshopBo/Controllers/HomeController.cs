using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebshopBo.Data;
using WebshopBo.Models;
using WebshopBo.Models.ViewHome;
using WebshopBo.Services;

namespace WebshopBo.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ICommon _iCommon;
        private readonly IWebHostEnvironment _iHostingEnvironment;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _env;
        public HomeController(ILogger<HomeController> logger, ApplicationDbContext context, IConfiguration configuration, ICommon common, IWebHostEnvironment iHostingEnvironment, UserManager<ApplicationUser> userManager, IWebHostEnvironment env)
        {
            _logger = logger;
            _context = context;
            _configuration = configuration;
            _iCommon = common;
            _iHostingEnvironment = iHostingEnvironment;
            _userManager = userManager;
            _env = env;
        }
        [Route("/page-list/load-more")]
        public IActionResult LoadMorePage(int page)
        {
            var pageSize = 2;
            var skip = (page - 1) * pageSize;

            var course = _context.Products
                            .Skip(skip)
                            .Take(pageSize)
                            .OrderByDescending(x => x.ID)
                            .ToList();
            return PartialView("_PostList", course);
        }
        public IActionResult Index()
        {
            ViewBag.userName = User.Identity.Name;
            var user = _context.ApplicationUser.Where(x => x.UserName == User.Identity.Name).FirstOrDefault();
            if (user != null)
            {
                ViewBag.Name = user.FullName;
            }
            var product = _context.Products.OrderByDescending(x => x.ID).Take(12).ToList();
            var categories = _context.Categories.ToList();
            var viewIndex = new ListViewHomeCRUD
            {
                ProductsList = product,
                CategoriesList = categories,
            };
            return View(viewIndex);
        }

        [Route("/products-shop")]

        public IActionResult ProductShop()
        {
            ViewBag.userName = User.Identity.Name;
            var user = _context.ApplicationUser.Where(x => x.UserName == User.Identity.Name).FirstOrDefault();
            if (user != null)
            {
                ViewBag.Name = user.FullName;
            }
            var product = _context.Products.OrderByDescending(x => x.ID).Take(2).ToList();
            var viewIndex = new ListViewHomeCRUD
            {
                ProductsList = product,
            };
            return View(viewIndex);
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [Route("/products-shop/{slug}")]
        public IActionResult DetailsProducts(string slug)
        {
            ViewBag.userName = User.Identity.Name;
            var user = _context.ApplicationUser.Where(x => x.UserName == User.Identity.Name).FirstOrDefault();
            if (user != null)
            {
                ViewBag.Name = user.FullName;
            }
            
            if (slug !=  "")
            {
                try
                {
                    var vm = _context.Products.FirstOrDefault(x => x.Slug == slug);

                    if (vm == null)
                    {
                        return BadRequest("Không tìm thấy đối tượng với ID tương ứng");
                    }
                    return View(vm);

                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }

            }
            else
            {
                return NotFound();
            }
        }
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}