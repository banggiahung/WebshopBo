using WebshopBo.Models.ProductsViewModels;
using System.ComponentModel.DataAnnotations;
using WebshopBo.Models;

namespace WebshopBo.Models.OrdersDetailsViewModels
{
    public class OrdersDetailsCRUDViewModels
    {
        public int OrderDetailId { get; set; }
        public int Order_Id { get; set; }
        public string? Product_Name { get; set; }
        public int? Product_Price { get; set; }
        public int? Product_Quantity { get; set; }
        public int ProductId { get; set; }
        public string? Product_Image { get; set; }
        public int OrderId { get; set; }

        public static implicit operator OrdersDetailsCRUDViewModels(OrderDetails _user)
		{
			return new OrdersDetailsCRUDViewModels
            {

                OrderDetailId = _user.OrderDetailId,
                Order_Id = _user.Order_Id,
                Product_Name = _user.Product_Name,
                Product_Price = _user.Product_Price,
                Product_Quantity = _user.Product_Quantity,
                ProductId = _user.ProductId,
                Product_Image = _user.Product_Image,
                OrderId = _user.OrderId,
			};
		}
		public static implicit operator OrderDetails(OrdersDetailsCRUDViewModels vm)
		{
			return new OrderDetails
            {

                OrderDetailId = vm.OrderDetailId,
                Order_Id = vm.Order_Id,
                Product_Name = vm.Product_Name,
                Product_Price = vm.Product_Price,
                Product_Quantity = vm.Product_Quantity,
                ProductId = vm.ProductId,
                Product_Image = vm.Product_Image,
                OrderId = vm.OrderId,
            };
		}
	}
}
