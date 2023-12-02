using Microsoft.AspNetCore.Mvc;
using WebshopBo.Services;

namespace WebshopBo.ViewComponents
{
    [ViewComponent(Name = "FooterMain")]
    public class FooterComponent : ViewComponent
    {
        private ICommon _icommom;

        public FooterComponent(ICommon icommom)
        {
            _icommom = icommom;
        }
        public IViewComponentResult Invoke()
        {
            return View();
        }
    }
}
