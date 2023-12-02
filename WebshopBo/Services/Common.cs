using Microsoft.EntityFrameworkCore;
using System.Net;

using Microsoft.AspNetCore.Identity;

using System.Drawing.Imaging;
using Path = System.IO.Path;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Linq.Expressions;
using System.IO;
using System.Reflection.Metadata.Ecma335;
using System.Collections;
using System.Globalization;
using System.Data;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using WebshopBo.Services;
using WebshopBo.Data;
using System.Security.Cryptography;
using System.Text;
using MailKit.Net.Smtp;
using MimeKit;
using WebshopBo.Models;
using static Org.BouncyCastle.Math.EC.ECCurve;
using System.Xml;

namespace WebshopBo.Services
{
    public class Common : ICommon
    {
        private readonly IWebHostEnvironment _iHostingEnvironment;
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

    


        public Common(IWebHostEnvironment iHostingEnvironment, ApplicationDbContext context, IConfiguration configuration)
        {
            _iHostingEnvironment = iHostingEnvironment;
            _context = context;
            _configuration = configuration;
            PaypalServices = new PayPal(_configuration);
        }
        public IPayPal PaypalServices { get; private set; }

      

        public string GetContentRootPath()
        {
            return _iHostingEnvironment.ContentRootPath;
        }
        public string GetFolderUploadPath()
        {
            return Path.Combine(_iHostingEnvironment.ContentRootPath, "wwwroot/Upload");
        }

        public async Task<string> UploadedFile(IFormFile ProfilePicture)
        {
            string ProfilePictureFileName = null;

            if (ProfilePicture != null)
            {
                string uploadsFolder = Path.Combine(_iHostingEnvironment.ContentRootPath, "wwwroot/Upload");

                if (ProfilePicture.FileName == null)
                    ProfilePictureFileName = Guid.NewGuid().ToString() + "_" + "blank-person.png";
                else
                    ProfilePictureFileName = Guid.NewGuid().ToString() + "_" + ProfilePicture.FileName;
                string filePath = Path.Combine(uploadsFolder, ProfilePictureFileName);
                using (var fileStream = new FileStream(filePath, FileMode.Create))
                {
                    ProfilePicture.CopyTo(fileStream);
                }
            }
            return ProfilePictureFileName;
        }
        public string GetSHA256(string str)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = Encoding.UTF8.GetBytes(str);
                byte[] hashBytes = sha256.ComputeHash(bytes);
                StringBuilder sb = new StringBuilder();

                for (int i = 0; i < hashBytes.Length; i++)
                {
                    sb.Append(hashBytes[i].ToString("x2"));
                }

                return sb.ToString();
            }
        }
		public string GetMD5(string str)
		{
			MD5 md5 = new MD5CryptoServiceProvider();
			byte[] fromData = Encoding.UTF8.GetBytes(str);
			byte[] targetData = md5.ComputeHash(fromData);
			string byte2String = null;

			for (int i = 0; i < targetData.Length; i++)
			{
				byte2String += targetData[i].ToString("x2");

			}
			return byte2String;
		}

        // thêm sitemap
        public async Task<bool> AddUrlToSitemap(string url)
        {
            try
            {
                var wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var sitemapPath = Path.Combine(wwwRootPath, "Sitemap_main.xml");
                string baseUrl = _configuration.GetSection("BaseURL").Value;
                if (!File.Exists(sitemapPath))
                {
                    throw new FileNotFoundException("Sitemap file not found.");
                }

                if (Uri.TryCreate($"{baseUrl}{url}", UriKind.Absolute, out Uri validatedUri))
                {
                    XmlDocument xmlDoc = new XmlDocument();
                    xmlDoc.Load(sitemapPath);

                    XmlElement urlElement = xmlDoc.CreateElement(null, "url", null);

                    XmlElement locElement = xmlDoc.CreateElement(null, "loc", null);
                    locElement.InnerText = validatedUri.AbsoluteUri;
                    urlElement.AppendChild(locElement);

                    XmlElement lastmodElement = xmlDoc.CreateElement(null, "lastmod", null);
                    lastmodElement.InnerText = DateTime.UtcNow.ToString("yyyy-MM-ddTHH:mm:ss");
                    urlElement.AppendChild(lastmodElement);

                    XmlElement priorityElement = xmlDoc.CreateElement(null, "priority", null);
                    priorityElement.InnerText = "0.9";
                    urlElement.AppendChild(priorityElement);

                    xmlDoc.DocumentElement?.AppendChild(urlElement);

                    await Task.Run(() => xmlDoc.Save(sitemapPath));

                    return true; 
                }
                else
                {
                    throw new ArgumentException("Invalid URL.");
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error while updating sitemap: {ex.Message}");
            }
        }
        public async Task<bool> RemoveUrlFromSitemap(string url)
        {
            try
            {
                var wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var sitemapPath = Path.Combine(wwwRootPath, "Sitemap_main.xml");
                string baseUrl = _configuration.GetSection("BaseURL").Value;

                if (!File.Exists(sitemapPath))
                {
                    throw new FileNotFoundException("Sitemap file not found.");
                }

                if (Uri.TryCreate($"{baseUrl}{url}", UriKind.Absolute, out Uri validatedUri))
                {
                    XmlDocument xmlDoc = new XmlDocument();
                    xmlDoc.Load(sitemapPath);

                    XmlNodeList locNodes = xmlDoc.GetElementsByTagName("loc");
                    foreach (XmlNode node in locNodes)
                    {
                        if (node.InnerText == validatedUri.AbsoluteUri)
                        {
                            XmlNode parentNode = node.ParentNode;
                            parentNode?.ParentNode?.RemoveChild(parentNode);
                            xmlDoc.Save(sitemapPath);
                            return true;
                        }
                    }

                    throw new ArgumentException("URL not found in the sitemap.");
                }
                else
                {
                    throw new ArgumentException("Invalid URL.");
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error while updating sitemap: {ex.Message}");
            }
        }
        public async Task<bool> CheckSlug(string slug, int Id)
        {
            try
            {
                var existingProduct = await _context.Products
                    .Where(p => p.Slug == slug && p.ID != Id)
                    .FirstOrDefaultAsync();

                if (existingProduct != null)
                {
                    return true; // Slug đã tồn tại cho sản phẩm khác
                }

                return false; // Slug không bị trùng lặp
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error while updating sitemap: {ex.Message}");
            }
        }
          public async Task<bool> CheckSlugAdd(string slug)
        {
            try
            {
                var existingProduct = await _context.Products
                    .Where(p => p.Slug == slug)
                    .FirstOrDefaultAsync();

                if (existingProduct != null)
                {
                    return true; // Slug đã tồn tại cho sản phẩm khác
                }

                return false; // Slug không bị trùng lặp
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error while updating sitemap: {ex.Message}");
            }
        }

        public async Task<bool> UpdateUrlInSitemap(string oldUrl, string newUrl)
        {
            try
            {
                var wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var sitemapPath = Path.Combine(wwwRootPath, "Sitemap_main.xml");
                string baseUrl = _configuration.GetSection("BaseURL").Value;

                if (!File.Exists(sitemapPath))
                {
                    throw new FileNotFoundException("Sitemap file not found.");
                }

                if (Uri.TryCreate($"{baseUrl}{oldUrl}", UriKind.Absolute, out Uri validatedOldUri) &&
                    Uri.TryCreate($"{baseUrl}{newUrl}", UriKind.Absolute, out Uri validatedNewUri))
                {
                    XmlDocument xmlDoc = new XmlDocument();
                    xmlDoc.Load(sitemapPath);

                    XmlNodeList locNodes = xmlDoc.GetElementsByTagName("loc");
                    foreach (XmlNode node in locNodes)
                    {
                        if (node.InnerText == validatedOldUri.AbsoluteUri)
                        {
                            // Update the URL
                            node.InnerText = validatedNewUri.AbsoluteUri;
                            xmlDoc.Save(sitemapPath);
                            return true;
                        }
                    }

                    throw new ArgumentException("URL not found in the sitemap.");
                }
                else
                {
                    throw new ArgumentException("Invalid URL.");
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException($"Error while updating sitemap: {ex.Message}");
            }
        }
        //public WebConfigCRUD GetAllWebConfig()
        //{
        //    var rs = _context.WebConfig.FirstOrDefault(x => x.ID == 1);

        //    var sub = _context.MainHeader.Include(x => x.SubHeader).ToList();

        //    var webConfigCRUD = new WebConfigCRUD
        //    {
        //        WebConfigMain = rs,
        //        HeaderMain = sub,
        //    };
        //    return webConfigCRUD;
        //}  
        //public WebConfigCRUD GetAllConfig()
        //{
        //    var rs = _context.WebConfig.FirstOrDefault(x => x.ID == 1);
        //    var sp = (from c in _context.FooterConfig
        //              join d in _context.Support on c.CauHinhHoTro equals d.ID
        //              select new Support
        //              {
        //                  ID = c.ID,
        //                  NamePage = d.NamePage,
        //                  Slug = d.Slug
        //              }).ToList();
        //    var config = (from c in _context.FooterConfig
        //                  join d in _context.PagePost on c.CauHinhFooter1 equals d.ID
        //                  select new PagePost
        //                  {
        //                      ID = c.ID,
        //                      NamePage = d.NamePage,
        //                      SlugPage = d.SlugPage,
        //                      CategoryPost = d.CategoryPost
        //                  }).ToList();
        //    var webConfigCRUD = new WebConfigCRUD
        //    {
        //        WebConfigMain = rs,
        //        SupportList = sp,
        //        PagePostList = config
        //    };
        //    return webConfigCRUD;
        //}
        public void SendEmail(ApplicationUser user)
        {

            var messageToUser = new MimeMessage();
            messageToUser.From.Add(new MailboxAddress("", _configuration.GetSection("EmailUserName").Value));
            messageToUser.To.Add(MailboxAddress.Parse(_configuration.GetSection("EmailSend").Value));
            messageToUser.Subject = "Khách đăng ký mới";
            var builder = new BodyBuilder();

            var emailTemplatePathUser = Path.Combine(_iHostingEnvironment.WebRootPath, "EmailUser.html");
            var emailTemplateUser = File.ReadAllText(emailTemplatePathUser);

            emailTemplateUser = emailTemplateUser.Replace("{nameUser}", user.FullName ?? "");
            emailTemplateUser = emailTemplateUser.Replace("{sdt}", user.PhoneNumber);
            emailTemplateUser = emailTemplateUser.Replace("{email}", user.Email);

            builder.HtmlBody = emailTemplateUser;
            messageToUser.Body = builder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                client.Connect(_configuration.GetSection("EmailHost").Value, 587, MailKit.Security.SecureSocketOptions.StartTls);
                client.Authenticate(_configuration.GetSection("EmailUserName").Value, _configuration.GetSection("EmailPassword").Value);
                client.Send(messageToUser);
                client.Disconnect(true);
            }
        }

        //     public void SendEmail(DataUser request)
        //     {

        //         var message = new MimeMessage();
        //         message.From.Add(new MailboxAddress("", _configuration.GetSection("EmailUserName").Value));
        //         message.To.Add(MailboxAddress.Parse(request.UserName));
        //         message.Subject = "Khôi phục mật khẩu";

        //         var builder = new BodyBuilder();
        ////builder.HtmlBody = $"Chào {request.UserName},{Environment.NewLine}{Environment.NewLine}Bạn đã yêu cầu khôi phục mật khẩu tại hệ thống của chúng tôi.{Environment.NewLine}Mã xác thực của bạn là {request.TokenPassword}.{Environment.NewLine}Mã xác thực này sẽ hết hạn trong vòng 30 phút. Vui lòng đăng nhập và thay đổi mật khẩu của bạn trong khoảng thời gian này.{Environment.NewLine}{Environment.NewLine}Trân trọng,{Environment.NewLine}Hệ thống quản lý.";

        //message.Body = builder.ToMessageBody();

        //         using (var client = new SmtpClient())
        //         {
        //             client.Connect(_configuration.GetSection("EmailHost").Value, 587, MailKit.Security.SecureSocketOptions.StartTls);
        //             client.Authenticate(_configuration.GetSection("EmailUserName").Value, _configuration.GetSection("EmailPassword").Value);
        //             client.Send(message);
        //             client.Disconnect(true);
        //         }
        //     }

        //     public string GenerateToken()
        //     {
        //         // Tạo mã ngẫu nhiên bằng cách sử dụng các ký tự khác nhau.
        //         const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        //         var random = new Random();
        //         var token = new string(
        //             Enumerable.Repeat(chars, 20)
        //             .Select(s => s[random.Next(s.Length)])
        //             .ToArray());

        //         return token;
        //     }

        //public void SendEmail( UserConfig user, int PayMoney )
        //{
        //    string formattedPayMoney = PayMoney.ToString("C0", new CultureInfo("vi-VN"));

        //    var messageToUser = new MimeMessage();
        //    messageToUser.From.Add(new MailboxAddress("", _configuration.GetSection("EmailUserName").Value));
        //    messageToUser.To.Add(MailboxAddress.Parse(_configuration.GetSection("EmailSend").Value));
        //    messageToUser.Subject = "Đơn nạp tiền";
        //    var builder = new BodyBuilder();

        //    var emailTemplatePathUser = Path.Combine(_iHostingEnvironment.WebRootPath, "EmailUser.html");
        //    var emailTemplateUser = File.ReadAllText(emailTemplatePathUser);

        //    emailTemplateUser = emailTemplateUser.Replace("{nameUser}", user.UserName ?? "");
        //    emailTemplateUser = emailTemplateUser.Replace("{moneyPay}", formattedPayMoney);

        //    builder.HtmlBody = emailTemplateUser;
        //    messageToUser.Body = builder.ToMessageBody();

        //    using (var client = new SmtpClient())
        //    {
        //        client.Connect(_configuration.GetSection("EmailHost").Value, 587, MailKit.Security.SecureSocketOptions.StartTls);
        //        client.Authenticate(_configuration.GetSection("EmailUserName").Value, _configuration.GetSection("EmailPassword").Value);
        //        client.Send(messageToUser);
        //        client.Disconnect(true);
        //    }
        //}
        //public void SendEmailUserNap(UserConfig user, int payMoney)
        //{

        //    string formattedPayMoney = payMoney.ToString("C0", new CultureInfo("vi-VN"));
        //    var messageToUser = new MimeMessage();
        //    messageToUser.From.Add(new MailboxAddress("", _configuration.GetSection("EmailUserName").Value));
        //    messageToUser.To.Add(MailboxAddress.Parse(user.UserName));
        //    messageToUser.Subject = "Thông báo nạp tiền thành công";
        //    var builder = new BodyBuilder();

        //    var emailTemplatePathUser = Path.Combine(_iHostingEnvironment.WebRootPath, "EmailUserNap.html");
        //    var emailTemplateUser = File.ReadAllText(emailTemplatePathUser);

        //    emailTemplateUser = emailTemplateUser.Replace("{nameUser}", user.UserName ?? "");
        //    emailTemplateUser = emailTemplateUser.Replace("{moneyPay}", formattedPayMoney);

        //    builder.HtmlBody = emailTemplateUser;
        //    messageToUser.Body = builder.ToMessageBody();

        //    using (var client = new SmtpClient())
        //    {
        //        client.Connect(_configuration.GetSection("EmailHost").Value, 587, MailKit.Security.SecureSocketOptions.StartTls);
        //        client.Authenticate(_configuration.GetSection("EmailUserName").Value, _configuration.GetSection("EmailPassword").Value);
        //        client.Send(messageToUser);
        //        client.Disconnect(true);
        //    }


        //}
    }

       
}