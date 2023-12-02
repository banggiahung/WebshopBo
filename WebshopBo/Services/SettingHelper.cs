using WebshopBo.Data;


namespace WebshopBo.Services
{
    public class SettingHelper
    {
        private readonly ApplicationDbContext _context;

        public SettingHelper(ApplicationDbContext context)
        {
            _context = context;
        }

        //public string GetValue(string key)
        //{
        //    var item = _context.WebConfig.Where(x=>x.ID == 1).FirstOrDefault();
        //    if (item != null)
        //    {
        //        return item.MetaTag;
        //    }
        //    return "";
        //}
    }
}
