using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebshopBo.Models
{
    public class Products
    {
        [Key]
        public int ID { get; set; }
        public int? Quantity { get; set; }
        public string? ProductName { get; set; }
        public string? Description { get; set; }
        public string? ShortDescription { get; set; }
        public string? Slug { get; set; }
        public int? Price { get; set; }
        public int? PriceDiscount { get; set; }
        public int? CategoryID { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string? ImageMain { get; set; }

        [ForeignKey("CategoryID")]
        public virtual Categories CategoriesMain { get; set; }
    }
}
