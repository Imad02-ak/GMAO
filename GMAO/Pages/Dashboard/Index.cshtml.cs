using System.Text.Json;
using System.Security.Claims;
using GMAO.Models;
using GMAO.Pages.Auth;
using GMAO.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace GMAO.Pages.Dashboard;

[ValidateAntiForgeryToken]
public class IndexModel : PageModel
{
    private readonly IOrganisationService _organisationService;
    private readonly IEquipementService _equipementService;
    private readonly IStockService _stockService;

    public string EntrepriseId { get; private set; } = string.Empty;

    public IndexModel(IOrganisationService organisationService, IEquipementService equipementService, IStockService stockService)
    {
        _organisationService = organisationService;
        _equipementService = equipementService;
        _stockService = stockService;
    }

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
        var companyCode = User.FindFirst("CompanyCode")?.Value ?? "4@gml";
        var companyName = User.FindFirst("CompanyName")?.Value ?? "Entreprise Nationale Sonatrach";
        if (RegisterModel.CompanyRegistry.TryGetValue(companyCode, out var registeredCompanyName))
        {
            companyName = registeredCompanyName;
        }

        ViewData["Title"] = "Tableau de bord";
        ViewData["UserName"] = displayName;
        ViewData["UserFirstName"] = firstName;
        ViewData["UserPrenom"] = firstName;
        ViewData["UserInitials"] = string.IsNullOrWhiteSpace(initials) ? "GM" : initials;
        ViewData["CompanyName"] = companyName;
        ViewData["CompanyCode"] = companyCode;
        EntrepriseId = companyCode;

        return Page();
    }

    public async Task<JsonResult> OnGetTreeAsync(string entrepriseId)
    {
        var unites = await _organisationService.GetUnitesAsync(entrepriseId);
        var equipements = await _equipementService.GetEquipementsAsync(entrepriseId);
        var tree = unites.Select(u => new
        {
            id = u.Id,
            type = "unite",
            code = u.Code,
            nom = u.Nom,
            children = equipements.Where(e => e.Service?.Departement?.Division?.UniteId == u.Id).Select(e => new
            {
                id = e.Id,
                type = "equipement",
                code = e.Tag,
                nom = e.Nom,
                children = new List<object>()
            }).ToList<object>()
        });
        return new JsonResult(tree) { StatusCode = 200 };
    }

    public async Task<JsonResult> OnGetUnitesAsync(string entrepriseId) => new((await _organisationService.GetUnitesAsync(entrepriseId))) { StatusCode = 200 };
    public async Task<JsonResult> OnGetDivisionsAsync(string entrepriseId)
    {
        var unites = await _organisationService.GetUnitesAsync(entrepriseId);
        var result = new List<Division>();
        foreach (var unite in unites) result.AddRange(await _organisationService.GetDivisionsAsync(unite.Id));
        return new JsonResult(result) { StatusCode = 200 };
    }
    public async Task<JsonResult> OnGetEquipementsAsync(string entrepriseId) => new((await _equipementService.GetEquipementsAsync(entrepriseId))) { StatusCode = 200 };
    public async Task<JsonResult> OnGetOrganesAsync(string entrepriseId)
    {
        var eqs = await _equipementService.GetEquipementsAsync(entrepriseId);
        var organes = new List<Organe>();
        foreach (var eq in eqs)
        {
            var sous = await _equipementService.GetSousEnsemblesAsync(eq.Id);
            foreach (var se in sous) organes.AddRange(await _equipementService.GetOrganesAsync(se.Id));
        }
        return new JsonResult(organes) { StatusCode = 200 };
    }
    public async Task<JsonResult> OnGetArticlesAsync(string entrepriseId) => new((await _stockService.GetArticlesAsync(entrepriseId))) { StatusCode = 200 };
    public async Task<JsonResult> OnGetMouvementsAsync(string entrepriseId) => new((await _stockService.GetMouvementsAsync(entrepriseId))) { StatusCode = 200 };
    public async Task<JsonResult> OnGetCommandesAsync(string entrepriseId) => new((await _stockService.GetCommandesAsync(entrepriseId))) { StatusCode = 200 };
    public async Task<JsonResult> OnGetFournisseursAsync(string entrepriseId) => new((await _stockService.GetFournisseursAsync(entrepriseId))) { StatusCode = 200 };
    public async Task<JsonResult> OnGetInterventionsAsync(string entrepriseId)
    {
        var eqs = await _equipementService.GetEquipementsAsync(entrepriseId);
        var result = new List<Intervention>();
        foreach (var eq in eqs) result.AddRange(await _equipementService.GetInterventionsAsync(eq.Id));
        return new JsonResult(result) { StatusCode = 200 };
    }

    public async Task<JsonResult> OnPostSaveUniteAsync() => await SaveBodyAsync<Unite>(async e => await _organisationService.SaveUniteAsync(e));
    public async Task<JsonResult> OnPostSaveEquipementAsync() => await SaveBodyAsync<Equipement>(async e => await _equipementService.SaveEquipementAsync(e));
    public async Task<JsonResult> OnPostSaveArticleAsync() => await SaveBodyAsync<Article>(async e => await _stockService.SaveArticleAsync(e));
    public async Task<JsonResult> OnPostSaveMouvementAsync() => await SaveBodyAsync<MouvementStock>(async e => await _stockService.SaveMouvementAsync(e));
    public async Task<JsonResult> OnPostSaveInterventionAsync() => await SaveBodyAsync<Intervention>(async e => await _equipementService.SaveInterventionAsync(e));
    public async Task<JsonResult> OnPostSaveCommandeAsync() => await SaveBodyAsync<CommandeAchat>(async e => await _stockService.SaveCommandeAsync(e));

    private async Task<JsonResult> SaveBodyAsync<T>(Func<T, Task> saveAction) where T : BaseEntity, new()
    {
        try
        {
            var payload = await JsonSerializer.DeserializeAsync<T>(Request.Body, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            if (payload is null)
            {
                return new JsonResult(new { success = false, error = "Payload invalide" });
            }

            await saveAction(payload);
            return new JsonResult(new { success = true, id = payload.Id });
        }
        catch (Exception ex)
        {
            return new JsonResult(new { success = false, error = ex.Message });
        }
    }
}
