using WebshopBo.Models.OrdersDetailsViewModels;
using WebshopBo.Models.ProductsViewModels;
using System.ComponentModel.DataAnnotations;
using WebshopBo.Models;

namespace ShopWebCustomer.Models.OrdersViewModels
{
    public class OrdersCRUDViewModels
    {
        public int OrderId { get; set; }
		public string? Customer_Id { get; set; }

		public string? Customer_Name { get; set; }
        public string? Phone_Number { get; set; }
        public string? Address { get; set; }
        public DateTime? CreateDate { get; set; }
        public bool? Order_Status { get; set; }
        public int? Total_Price { get; set; }
        public int? ProductIds { get; set; }
        public int? Product_Quantity { get; set; }

        public List<OrdersDetailsCRUDViewModels> OrdersDetailsList { get; set; }


        public static implicit operator OrdersCRUDViewModels(Orders _user)
		{
			return new OrdersCRUDViewModels
            {

                OrderId = _user.OrderId,
                Customer_Id = _user.Customer_Id,
                Customer_Name = _user.Customer_Name,
                Phone_Number = _user.Phone_Number,
                Address = _user.Address,
                CreateDate = _user.CreateDate,
                Order_Status = _user.Order_Status,
                Total_Price = _user.Total_Price,
			};
		}
		public static implicit operator Orders(OrdersCRUDViewModels vm)
		{
			return new Orders
            {

                OrderId = vm.OrderId,
                Customer_Id = vm.Customer_Id,
                Customer_Name = vm.Customer_Name,
                Phone_Number = vm.Phone_Number,
                Address = vm.Address,
                CreateDate = vm.CreateDate,
                Order_Status = vm.Order_Status,
                Total_Price = vm.Total_Price,
            };
		}
	}
}
