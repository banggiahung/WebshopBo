using Microsoft.AspNetCore.Identity;

namespace WebshopBo.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string? AvatartPath { get; set; }
        public string? FullName { get; set; }
        public string? BacnAcc { get; set; }
        public string? BackNumber {set; get;}
        public string? Address { set; get;}
        public double Amount { get; set; }
        public bool IsAcitive { get; set; }
        public int? MoneyTotal { get; set; }
        public string? InvitedCode { get; set; }
        public int? TotallBillCreated { get; set; }
        public DateTime CreateDate { get; set; }

    }
}
