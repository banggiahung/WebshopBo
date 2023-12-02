using Microsoft.AspNetCore.Mvc;
using WebshopBo.Services;

namespace WebshopBo.ViewComponents
{
    [ViewComponent(Name = "HeaderMain")]
    public class MenuComponent : ViewComponent
    {
        private ICommon _icommom;

        public MenuComponent(ICommon icommom)
        {
            _icommom = icommom;
        }
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}
