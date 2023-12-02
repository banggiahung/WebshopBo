using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebshopBo.Data;
using WebshopBo.Models;
using WebshopBo.Models.CategoriesViewModels;
using WebshopBo.Models.ProductsViewModels;
using WebshopBo.Services;

namespace WebshopBo.Areas.AdminWeb.Controllers
{
    [Area("AdminWeb")]
    [Authorize(Roles = "Admin")]

    public class CategoriesController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ICommon _iCommon;
        private readonly IWebHostEnvironment _iHostingEnvironment;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IWebHostEnvironment _env;
        public CategoriesController(ApplicationDbContext context, IConfiguration configuration, ICommon common, IWebHostEnvironment iHostingEnvironment, UserManager<ApplicationUser> userManager, IWebHostEnvironment env)
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
        [HttpGet]
        public IActionResult GetAllCategories()
        {
            var products = _context.Categories.OrderByDescending(x=>x.CategoryID).ToList();
            return Ok(products);
        }
        [HttpPost]
        public async Task<IActionResult> AddCategory(CategoriesCRUDViewModels model)
        {
            try
            {
                if (model.PrPath != null)
                {
                    var PrPath = await _iCommon.UploadedFile(model.PrPath);
                    model.ImageCategory = "/upload/" + PrPath;
                }
                model.CreatedDate = DateTime.Now;
                model.ModifiedDate = DateTime.Now;
                _context.Categories.Add(model);
                await _context.SaveChangesAsync();
                return Ok(model);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }
        [HttpGet]
        public async Task<IActionResult> getIdCategory(int id)
        {
            try
            {
                Categories vm = new Categories();
                if (id > 0)
                {
                    try
                    {
                        vm = await _context.Categories.FirstOrDefaultAsync(x => x.CategoryID == id);

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
        public async Task<IActionResult> UpdateCategory(CategoriesCRUDViewModels model)
        {
            try
            {
                var existingProduct = await _context.Categories.FindAsync(model.CategoryID);

                if (existingProduct == null)
                {
                    return NotFound("Không tìm thấy");
                }

                if (model.PrPath != null)
                {
                    var PrPath = await _iCommon.UploadedFile(model.PrPath);
                    existingProduct.ImageCategory = "/upload/" + PrPath;
                }

                existingProduct.CategoryName = model.CategoryName;
                existingProduct.Slug = model.Slug;
                existingProduct.ModifiedDate = DateTime.Now;
                await _context.SaveChangesAsync();

                return Ok(existingProduct);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        public async Task<IActionResult> DeleteCategory(CategoriesCRUDViewModels model)
        {
            try
            {
                var existingProduct = await _context.Categories.FirstOrDefaultAsync(x => x.CategoryID == model.CategoryID);

                if (existingProduct == null)
                {
                    return NotFound();

                }
                _context.Categories.Remove(existingProduct);
                await _context.SaveChangesAsync();

                return Ok(existingProduct);


            }

            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }
    }
}
