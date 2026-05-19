using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using GMAO.Data;
using GMAO.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace GMAO.Pages.Auth;

public class LoginModel : PageModel
{
    private readonly ILogger<LoginModel> _logger;
    private readonly GmaoDbContext _db;
    private readonly IPasswordHasher<UserAccount> _passwordHasher;

    [BindProperty]
    public InputModel Input { get; set; } = new();

    public LoginModel(ILogger<LoginModel> logger, GmaoDbContext db, IPasswordHasher<UserAccount> passwordHasher)
    {
        _logger = logger;
        _db = db;
        _passwordHasher = passwordHasher;
    }

    public IActionResult OnGet()
    {
        if (User?.Identity?.IsAuthenticated == true)
        {
            return RedirectToPage("/Dashboard/Index");
        }

        return Page();
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (!ModelState.IsValid)
        {
            return Page();
        }

        var normalizedEmail = Input.Email.Trim().ToLowerInvariant();
        var user = await _db.UserAccounts.AsNoTracking().FirstOrDefaultAsync(u => u.Email == normalizedEmail);
        if (user is null)
        {
            ModelState.AddModelError("Input.Email", "Adresse email introuvable.");
            return Page();
        }

        var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, Input.Password);
        if (verificationResult == PasswordVerificationResult.Failed)
        {
            ModelState.AddModelError("Input.Password", "Mot de passe incorrect.");
            return Page();
        }

        var companyCodeInput = Input.CompanyCode.Trim();
        var entreprise = await _db.Entreprises.AsNoTracking().FirstOrDefaultAsync(e => e.Code == companyCodeInput);
        if (entreprise is null)
        {
            ModelState.AddModelError("Input.CompanyCode", "Code entreprise invalide.");
            return Page();
        }

        if (!string.Equals(user.EntrepriseId, entreprise.Id, StringComparison.OrdinalIgnoreCase))
        {
            ModelState.AddModelError("Input.CompanyCode", "Ce compte n'est pas associé à cette entreprise.");
            return Page();
        }

        var displayName = string.Join(' ', new[] { user.FirstName, user.LastName }.Where(part => !string.IsNullOrWhiteSpace(part)));
        if (string.IsNullOrWhiteSpace(displayName))
        {
            displayName = user.Email;
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, displayName),
            new Claim(ClaimTypes.GivenName, user.FirstName ?? string.Empty),
            new Claim("CompanyName", entreprise.Nom),
            new Claim("CompanyCode", entreprise.Code),
            new Claim("EntrepriseId", entreprise.Id)
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
