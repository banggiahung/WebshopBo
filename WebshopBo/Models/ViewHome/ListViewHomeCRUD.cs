namespace WebshopBo.Models.ViewHome
{
    public class ListViewHomeCRUD
    {
        public List<Categories> CategoriesList { get; set; }
        public List<Products> ProductsList { get; set; }

        public List<OrderDetails> OrderDetailsList { get; set; }
        public Orders OrderMain { get; set; }
    }
}
