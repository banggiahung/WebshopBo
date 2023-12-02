namespace WebshopBo.Models.AccountVM
{
    public class Profile: ApplicationUser
    {
        public string PackageNameCateId1 { get; set; }
        public string PackageNameCateId2 { get; set; }
        public string PackageNameCateId3 { get; set; }
        public int? Count1 { get; set; }
        public int? Count2 { get; set; }
        public int? Count3 { get; set; }
    }
}
