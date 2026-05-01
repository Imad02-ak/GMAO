using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace GMAO.Pages.Dashboard;

public class IndexModel : PageModel
{
    public IActionResult OnGet()
    {
        if (User?.Identity?.IsAuthenticated != true)
        {
            return RedirectToPage("/Auth/Login");
        }

        var displayName = User.Identity?.Name ?? "Ahmed Bensaid";
        var firstName = User.FindFirst(ClaimTypes.GivenName)?.Value
            ?? displayName.Split(' ', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault()
            ?? "Ahmed";
        var initials = string.Join(string.Empty, displayName.Split(' ', StringSplitOptions.RemoveEmptyEntries)
            .Where(part => !string.IsNullOrWhiteSpace(part))
            .Select(part => char.ToUpperInvariant(part[0]))
            .Take(2));
        var companyName = User.FindFirst("CompanyName")?.Value ?? "Entreprise Nationale Sonatrach";
        var companyCode = User.FindFirst("CompanyCode")?.Value ?? "4@gml";

        ViewData["Title"] = "Tableau de bord";
        ViewData["UserName"] = displayName;
        ViewData["UserFirstName"] = firstName;
        ViewData["UserInitials"] = string.IsNullOrWhiteSpace(initials) ? "GM" : initials;
        ViewData["CompanyName"] = companyName;
        ViewData["CompanyCode"] = companyCode;

        return Page();
    }
}
