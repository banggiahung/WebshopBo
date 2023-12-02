using System.ComponentModel.DataAnnotations;

namespace WebshopBo.Models
{
    public class Categories
    {
        [Key]
        public int CategoryID { get; set; }
        public string? CategoryName { get; set; }
        public string? ImageCategory { get; set; }
        public string? Slug { get; set; }

        public DateTime? CreatedDate { get; set; }
        public DateTime? ModifiedDate { get; set; }
    }
}
