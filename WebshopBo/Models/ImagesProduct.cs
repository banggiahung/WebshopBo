using System.ComponentModel.DataAnnotations;

namespace WebshopBo.Models
{
    public class ImagesProduct
    {
        [Key]
        public int ID { get; set; }
        public int ProductID { get; set; }
        public string? ImageUrl { get; set; }
    }
}
