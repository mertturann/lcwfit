using Microsoft.AspNetCore.Mvc;
using thursday9.Models;
using thursday9.Data;
using System.Diagnostics;
using Microsoft.DotNet.MSIdentity.Shared;

namespace thursday9.Controllers
{
    public class FitController : Controller
    {
        private readonly DataContext _context;
        public FitController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ActionName("Index")]
        public IActionResult IndexPost()
        {
            var icerikler = _context.DataFit.ToList();
            return PartialView("_PartialForSearch", icerikler);
        }
        [HttpPost]
        public IActionResult LiveSearch(string search)
        {
            var fit = _context.DataFit.Where(x => x.Title.Contains(search)).ToList();
            return PartialView("_PartialForSearch", fit);

        }

        public IActionResult Test()
        {
            return View();
        }

        [ValidateAntiForgeryToken]
        [HttpPost]
        public IActionResult Print([FromBody] List<int> selectedIds)
        {


    var fits = _context.DataFit
                        .Where(x => selectedIds.Contains(x.Id))
                        .Select(x => x.Image)
                        .ToList();

    if (fits == null || fits.Count == 0)
    {
        return Json(new { success = false, message = "No matching items found" });
    }

    return Json(new { success = true, data = fits });

        }
    }
}