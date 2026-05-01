using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace GMAO.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;

        public IndexModel(ILogger<IndexModel> logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Redirects users to the authentication entry point.
        /// </summary>
        public IActionResult OnGet()
        {
            return RedirectToPage("/Auth/Login");
        }
    }
}
