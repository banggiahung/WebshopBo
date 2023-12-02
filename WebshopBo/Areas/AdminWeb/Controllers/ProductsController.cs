using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebshopBo.Data;
using WebshopBo.Models;
using WebshopBo.Models.ProductsViewModels;
using WebshopBo.Services;

namespace WebshopBo.Areas.AdminWeb.Controllers
{
    [Area("AdminWeb")]
    [Authorize(Roles = "Admin")]

    public class ProductsController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ICommon _iCommon;
        private readonly IWebHostEnvironment _iHostingEnvironment;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _env;
        public ProductsController(ApplicationDbContext context, IConfiguration configuration, ICommon common, IWebHostEnvironment iHostingEnvironment, UserManager<ApplicationUser> userManager, IWebHostEnvironment env)
        {
            _context = context;
            _configuration = configuration;
            _iCommon = common;
            _iHostingEnvironment = iHostingEnvironment;
            _userManager = userManager;
            _env = env;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Edit(int id)
        {
            if (id > 0)
            {
                try
                {
                    var vm = _context.Products.Include(x=>x.CategoriesMain).FirstOrDefault(x => x.ID == id);

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
        [HttpGet]
        public IActionResult GetAllProducts()
        {
            var products = _context.Products.Include(x=>x.CategoriesMain).OrderByDescending(x=>x.ID).ToList();
            return Ok(products);
        }
        [HttpPost]
        public async Task<IActionResult> AddProduct(ProductsCRUDViewModels model)
        {
            try
            {
                bool check = await _iCommon.CheckSlugAdd(model.Slug);
                if (check)
                {
                    return Ok(new { code = 400, message = "Slug đã trùng với sản phẩm khác" });
                }
                else
                {
                    if (model.PrPath != null)
                    {
                        var PrPath = await _iCommon.UploadedFile(model.PrPath);
                        model.ImageMain = "/Upload/" + PrPath;
                    }
                    model.CreatedDate = DateTime.Now;
                    _context.Products.Add(model);
                    await _context.SaveChangesAsync();
                    return Ok(model);
                }
              



            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }
        [HttpGet]
        public async Task<IActionResult> getIdProducts(int id)
        {
            try
            {
                Products vm = new Products();
                if (id > 0)
                {
                    try
                    {
                        vm =  _context.Products.Where(x=>x.ID == id).Include(x=>x.CategoriesMain).FirstOrDefault();

                        if (vm == null)
                        {
                            return BadRequest("Không tìm thấy đối tượng với ID tương ứng");
                        }
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


                return Ok(vm);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost]
        public async Task<IActionResult> deleteProducts(Products model)
        {
            try
            {
                var existingProduct = await _context.Products.FirstOrDefaultAsync(x => x.ID == model.ID);

                if (existingProduct == null)
                {
                    return NotFound();

                }
                _context.Products.Remove(existingProduct);
                await _context.SaveChangesAsync();

                return Ok(existingProduct);


            }

            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }
        [HttpPost]
        public async Task<IActionResult> UpdateProduct(ProductsCRUDViewModels model)
        {
            try
            {
                var existingProduct = await _context.Products.FindAsync(model.ID);

                if (existingProduct == null)
                {
                    return NotFound("Không tìm thấy");
                }

                bool check = await _iCommon.CheckSlug(model.Slug , model.ID);
                if (check)
                {
                    return BadRequest(new { code = 400, message = "Slug đã trùng với sản phẩm khác" });
                }
                else
                {
                    if (model.PrPath != null)
                    {
                        var PrPath = await _iCommon.UploadedFile(model.PrPath);
                        existingProduct.ImageMain = "/Upload/" + PrPath;
                    }


                    existingProduct.ProductName = model.ProductName;
                    existingProduct.Description = model.Description;
                    existingProduct.Quantity = model.Quantity;
                    existingProduct.Slug = model.Slug;
                    existingProduct.Price = model.Price;
                    existingProduct.PriceDiscount = model.PriceDiscount;
                    existingProduct.CategoryID = model.CategoryID;
                    existingProduct.ShortDescription = model.ShortDescription;

                    await _context.SaveChangesAsync();

                    return Ok(existingProduct);
                }
                
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

    }
}
