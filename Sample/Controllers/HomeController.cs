using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace subpages.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Message = "This is the main app page";

            return View();
        }

        public ActionResult SubpageParent()
        {
            ViewBag.Message = "This is the Parent for the sub-page.";

            return View();
        }

    }
}
