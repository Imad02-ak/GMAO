using System.ComponentModel.DataAnnotations;
using GMAO.Data;
using GMAO.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;

namespace GMAO.Pages.Auth;

public class RegisterModel : PageModel
{
    private readonly GmaoDbContext _db;
    private readonly IPasswordHasher<UserAccount> _passwordHasher;
    private readonly ILogger<RegisterModel> _logger;

    [BindProperty]
    public InputModel Input { get; set; } = new();

    public bool ShowCompanyCreated { get; private set; }

    public string CompanyCode { get; private set; } = string.Empty;

    public RegisterModel(GmaoDbContext db, IPasswordHasher<UserAccount> passwordHasher, ILogger<RegisterModel> logger)
    {
        _db = db;
        _passwordHasher = passwordHasher;
        _logger = logger;
    }

    public void OnGet()
    {
    }

    public async Task<IActionResult> OnPostAsync()
    {
        if (Input.CreateNewCompany)
        {
            ModelState.Remove("Input.CompanyCode");
        }
        else
        {
            ModelState.Remove("Input.CompanyName");
            ModelState.Remove("Input.Wilaya");
            ModelState.Remove("Input.Daira");
            ModelState.Remove("Input.Commune");
            ModelState.Remove("Input.CompanyCreationDate");
            ModelState.Remove("Input.PhoneNumber");
        }

        if (!ModelState.IsValid)
        {
            return Page();
        }

        var normalizedEmail = (Input.Email ?? string.Empty).Trim().ToLowerInvariant();
        if (await _db.UserAccounts.AsNoTracking().AnyAsync(user => user.Email == normalizedEmail))
        {
            ModelState.AddModelError("Input.Email", "Cette adresse e-mail est d�j� utilis�e.");
            return Page();
        }

        var companyCodeInput = (Input.CompanyCode ?? string.Empty).Trim();
        Entreprise? entreprise;
        if (Input.CreateNewCompany)
        {
            CompanyCode = GenerateCompanyCode();
            entreprise = new Entreprise
            {
                Code = CompanyCode,
                Nom = (Input.CompanyName ?? string.Empty).Trim(),
                Wilaya = (Input.Wilaya ?? string.Empty).Trim(),
                Daira = (Input.Daira ?? string.Empty).Trim(),
                Commune = (Input.Commune ?? string.Empty).Trim(),
                DateCreation = Input.CompanyCreationDate,
                Telephone = (Input.PhoneNumber ?? string.Empty).Trim()
            };

            _db.Entreprises.Add(entreprise);
        }
        else
        {
            entreprise = await _db.Entreprises.SingleOrDefaultAsync(e => e.Code == companyCodeInput);
            if (entreprise is null)
            {
                ModelState.AddModelError("Input.CompanyCode", "Aucune entreprise trouv�e pour ce code.");
                return Page();
            }
        }

        var userAccount = new UserAccount
        {
            FirstName = (Input.FirstName ?? string.Empty).Trim(),
            LastName = (Input.LastName ?? string.Empty).Trim(),
            BirthDate = Input.BirthDate,
            Email = normalizedEmail,
            EntrepriseId = entreprise.Id
        };
        userAccount.PasswordHash = _passwordHasher.HashPassword(userAccount, Input.Password);

        _db.UserAccounts.Add(userAccount);

        try
        {
            await _db.SaveChangesAsync();
        }
        catch (DbUpdateException ex)
        {
            _logger.LogError(ex, "Erreur lors de l'enregistrement de l'inscription.");
            ModelState.AddModelError(string.Empty, "Impossible d'enregistrer le compte pour le moment.");
            return Page();
        }

        ShowCompanyCreated = Input.CreateNewCompany;

        return Page();
    }

    private static string GenerateCompanyCode()
    {
        return $"GMAO-{Guid.NewGuid().ToString("N")[..8].ToUpperInvariant()}";
    }

    public sealed class InputModel
    {
        [Required(ErrorMessage = "Le pr�nom est obligatoire.")]
        [Display(Name = "Pr�nom")]
        public string FirstName { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le nom de famille est obligatoire.")]
        [Display(Name = "Nom de famille")]
        public string LastName { get; set; } = string.Empty;

        [Required(ErrorMessage = "La date de naissance est obligatoire.")]
        [DataType(DataType.Date)]
        [Display(Name = "Date de naissance")]
        public DateTime? BirthDate { get; set; }

        [Required(ErrorMessage = "L'adresse e-mail est obligatoire.")]
        [EmailAddress(ErrorMessage = "Veuillez saisir une adresse e-mail valide.")]
        [Display(Name = "Adresse e-mail")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le mot de passe est obligatoire.")]
        [DataType(DataType.Password)]
        [Display(Name = "Mot de passe")]
        public string Password { get; set; } = string.Empty;

        [Required(ErrorMessage = "La confirmation du mot de passe est obligatoire.")]
        [DataType(DataType.Password)]
        [Display(Name = "Confirmer le mot de passe")]
        [Compare("Password", ErrorMessage = "Les mots de passe ne correspondent pas.")]
        public string ConfirmPassword { get; set; } = string.Empty;

        [Display(Name = "Cr�er une nouvelle entreprise")]
        public bool CreateNewCompany { get; set; }

        [Required(ErrorMessage = "Le code entreprise est obligatoire.")]
        [Display(Name = "Code entreprise")]
        public string CompanyCode { get; set; } = string.Empty;

        [Required(ErrorMessage = "Le nom de l'entreprise est obligatoire.")]
        [Display(Name = "Nom de l'entreprise")]
        public string CompanyName { get; set; } = string.Empty;

        [Required(ErrorMessage = "La wilaya est obligatoire.")]
        [Display(Name = "Wilaya")]
        public string Wilaya { get; set; } = string.Empty;

        [Required(ErrorMessage = "La da�ra est obligatoire.")]
        [Display(Name = "Da�ra")]
        public string Daira { get; set; } = string.Empty;

        [Required(ErrorMessage = "La commune est obligatoire.")]
        [Display(Name = "Commune")]
        public string Commune { get; set; } = string.Empty;

        [Required(ErrorMessage = "La date de cr�ation est obligatoire.")]
        [DataType(DataType.Date)]
        [Display(Name = "Date de cr�ation de l'entreprise")]
        public DateTime? CompanyCreationDate { get; set; }

        [Required(ErrorMessage = "Le num�ro de t�l�phone est obligatoire.")]
        [Phone(ErrorMessage = "Veuillez saisir un num�ro de t�l�phone valide.")]
        [Display(Name = "Num�ro de t�l�phone")]
        public string PhoneNumber { get; set; } = string.Empty;
    }
}
