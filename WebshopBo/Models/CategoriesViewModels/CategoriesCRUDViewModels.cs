using WebshopBo.Models.ProductsViewModels;

namespace WebshopBo.Models.CategoriesViewModels
{
    public class CategoriesCRUDViewModels
    {
        public int CategoryID { get; set; }
        public string? CategoryName { get; set; }
        public string? ImageCategory { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
        public IFormFile? PrPath { get; set; }
        public string? Slug { get; set; }



        public static implicit operator CategoriesCRUDViewModels(Categories _user)
        {
            return new CategoriesCRUDViewModels
            {
                CategoryID = _user.CategoryID,
                CategoryName = _user.CategoryName,
                ImageCategory = _user.ImageCategory,
                CreatedDate = _user.CreatedDate,
                ModifiedDate = _user.ModifiedDate,
                Slug = _user.Slug,

            };
        }
        public static implicit operator Categories(CategoriesCRUDViewModels vm)
        {
            return new Categories
            {
                CategoryID = vm.CategoryID,
                CategoryName = vm.CategoryName,
                ImageCategory = vm.ImageCategory,
                CreatedDate = vm.CreatedDate,
                ModifiedDate = vm.ModifiedDate,
                Slug = vm.Slug,
            };
        }
    }
}
