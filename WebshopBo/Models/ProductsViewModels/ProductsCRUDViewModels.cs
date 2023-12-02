namespace WebshopBo.Models.ProductsViewModels
{
    public class ProductsCRUDViewModels
    {
        public int ID { get; set; }
        public int? Quantity { get; set; }

        public string? ProductName { get; set; }
        public string? Description { get; set; }
        public string? Slug { get; set; }
        public int? Price { get; set; }
        public int? PriceDiscount { get; set; }
        public int? CategoryID { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? ImageMain { get; set; }
        public IFormFile? PrPath { get; set; }
        public string? CategoryName { get; set; }
        public string? ShortDescription { get; set; }



        public static implicit operator ProductsCRUDViewModels(Products _user)
        {
            return new ProductsCRUDViewModels
            {
                Quantity = _user.Quantity,
                ProductName = _user.ProductName,
                Description = _user.Description,
                ShortDescription = _user.ShortDescription,
                Slug = _user.Slug,
                Price = _user.Price,
                CategoryID = _user.CategoryID,
                CreatedDate = _user.CreatedDate,
                ImageMain = _user.ImageMain,
                ID = _user.ID,
                PriceDiscount = _user.PriceDiscount,
            };
        }
        public static implicit operator Products(ProductsCRUDViewModels vm)
        {
            return new Products
            {
                Quantity = vm.Quantity,
                ProductName = vm.ProductName,
                Description = vm.Description,
                ShortDescription = vm.ShortDescription,
                Slug = vm.Slug,
                Price = vm.Price,
                CategoryID = vm.CategoryID,
                CreatedDate = vm.CreatedDate,
                ImageMain = vm.ImageMain,
                ID = vm.ID,
                PriceDiscount = vm.PriceDiscount
            };
        }
    }
}
