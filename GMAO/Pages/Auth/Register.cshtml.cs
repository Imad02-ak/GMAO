using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace GMAO.Pages.Auth;

public class RegisterModel : PageModel
{
    public static IDictionary<string, string> CompanyRegistry { get; } = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

    [BindProperty]
    public InputModel Input { get; set; } = new();

    public bool ShowCompanyCreated { get; private set; }

    public string CompanyCode { get; private set; } = string.Empty;

    /// <summary>
    /// Loads the registration page.
    /// </summary>
    public void OnGet()
    {
    }

    /// <summary>
    /// Handles registration form submissions.
    /// </summary>
    public IActionResult OnPost()
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

        if (Input.CreateNewCompany)
        {
            ShowCompanyCreated = true;
            CompanyCode = GenerateCompanyCode();
            if (!string.IsNullOrWhiteSpace(Input.CompanyName))
            {
                CompanyRegistry[CompanyCode] = Input.CompanyName.Trim();
            }
        }

        return Page();
    }

    private static string GenerateCompanyCode()
    {
        return $"GMAO-{Guid.NewGuid().ToString("N")[..8].ToUpperInvariant()}";
    }

    public sealed class InputModel
    {
        [Required(ErrorMessage = "Le prénom est obligatoire.")]
        [Display(Name = "Prénom")]
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

        [Display(Name = "Créer une nouvelle entreprise")]
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

        [Required(ErrorMessage = "La daïra est obligatoire.")]
        [Display(Name = "Daïra")]
        public string Daira { get; set; } = string.Empty;

        [Required(ErrorMessage = "La commune est obligatoire.")]
        [Display(Name = "Commune")]
        public string Commune { get; set; } = string.Empty;

        [Required(ErrorMessage = "La date de création est obligatoire.")]
        [DataType(DataType.Date)]
        [Display(Name = "Date de création de l'entreprise")]
        public DateTime? CompanyCreationDate { get; set; }

        [Required(ErrorMessage = "Le numéro de téléphone est obligatoire.")]
        [Phone(ErrorMessage = "Veuillez saisir un numéro de téléphone valide.")]
        [Display(Name = "Numéro de téléphone")]
        public string PhoneNumber { get; set; } = string.Empty;
    }
}
