using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace GMAO.Pages.Auth;

public class LoginModel : PageModel
{
    [BindProperty]
    public InputModel Input { get; set; } = new();

    /// <summary>
    /// Loads the login page.
    /// </summary>
    public IActionResult OnGet()
    {
        if (User?.Identity?.IsAuthenticated == true)
        {
            return RedirectToPage("/Dashboard/Index");
        }

        return Page();
    }

    /// <summary>
    /// Handles the login submission.
    /// </summary>
    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            return Page();
        }

        var displayName = Input.Email.Split('@', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? "Utilisateur";
        var firstName = displayName.Split(' ', StringSplitOptions.RemoveEmptyEntries).FirstOrDefault() ?? displayName;
        var companyName = RegisterModel.CompanyRegistry.TryGetValue(Input.CompanyCode, out var registeredCompany)
            ? registeredCompany
            : string.Equals(Input.CompanyCode, "4@gml", StringComparison.OrdinalIgnoreCase)
                ? "Entreprise Nationale Sonatrach"
                : Input.CompanyCode;

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, displayName),
            new Claim(ClaimTypes.GivenName, firstName),
            new Claim("CompanyName", companyName),
            new Claim("CompanyCode", Input.CompanyCode)
        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);

        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

        return RedirectToPage("/Dashboard/Index");
    }

    public sealed class InputModel
    {
        [Required(ErrorMessage = "L'adresse e-mail est obligatoire.")]
        [EmailAddress(ErrorMessage = "Veuillez saisir une adresse e-mail valide.")]
        [Display(Name = "Adresse e-mail")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le mot de passe est obligatoire.")]
        [DataType(DataType.Password)]
        [Display(Name = "Mot de passe")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le code entreprise est obligatoire.")]
        [Display(Name = "Code entreprise")]
        public string CompanyCode { get; set; } = string.Empty;
    }
}
