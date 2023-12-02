using Microsoft.AspNetCore.Identity;
using System.Drawing;
using System.Collections;
using WebshopBo.Models;
using PayPal.Api;
namespace WebshopBo.Services
{
    public interface ICommon
    {
        Task<string> UploadedFile(IFormFile ProfilePicture);
        Task<bool> CheckSlug(string slug, int Id);
        Task<bool> CheckSlugAdd(string slug);
        string GetSHA256(string str);
		string GetMD5(string str);

        IPayPal PaypalServices { get; }

        //void SendEmail(ApplicationUser user);

        //Task<bool> AddUrlToSitemap(string url);

        //Task<bool> RemoveUrlFromSitemap(string url);

        //Task<bool> UpdateUrlInSitemap(string oldUrl, string newUrl);

        ////void SendEmail(UserConfig user, int PayMoney);
        ////void SendEmailUserNap(UserConfig user, int payMoney);

        ////void SendEmail(DataUser request);
        ////string GenerateToken();
        //WebConfigCRUD GetAllWebConfig();
        //WebConfigCRUD GetAllConfig();

    }
}
