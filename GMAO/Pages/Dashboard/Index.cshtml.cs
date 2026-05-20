using System.Security.Claims;
using System;
using System.Linq;
using System.Text.Json;
using GMAO.Data;
using GMAO.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace GMAO.Pages.Dashboard;

[ValidateAntiForgeryToken]
public class IndexModel : PageModel
{
    private readonly ILogger<IndexModel> _logger;
    private readonly GmaoDbContext _db;

    public string EntrepriseId { get; private set; } = string.Empty;

    public IndexModel(ILogger<IndexModel> logger, GmaoDbContext db)
    {
        _logger = logger;
        _db = db;
    }

    public async Task<IActionResult> OnGetAsync()
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
        var companyId = User.FindFirst("EntrepriseId")?.Value;
        var companyCode = User.FindFirst("CompanyCode")?.Value
            ?? companyId
            ?? "4@gml";
        var companyName = User.FindFirst("CompanyName")?.Value
            ?? "Entreprise";

        ViewData["Title"] = "Tableau de bord";
        ViewData["UserName"] = displayName;
        ViewData["UserFirstName"] = firstName;
        ViewData["UserPrenom"] = firstName;
        ViewData["UserInitials"] = string.IsNullOrWhiteSpace(initials) ? "GM" : initials;
        ViewData["CompanyName"] = companyName;
        ViewData["CompanyCode"] = companyCode;
        EntrepriseId = companyId ?? companyCode;

        return Page();
    }

    public async Task<JsonResult> OnGetTreeAsync(string entrepriseId)
    {
        var resolvedEntrepriseId = ResolveEntrepriseId(entrepriseId);
        if (string.IsNullOrWhiteSpace(resolvedEntrepriseId))
        {
            return new JsonResult(Array.Empty<object>()) { StatusCode = 200 };
        }

        var groupes = await _db.GroupesEquipements.AsNoTracking()
            .OrderBy(g => g.Nom)
            .Select(g => new
            {
                id = g.Id,
                code = g.Code,
                nom = g.Nom,
                designation = g.Description
            })
            .ToListAsync();

        var familles = await _db.FamillesEquipements.AsNoTracking()
            .OrderBy(f => f.Nom)
            .Select(f => new
            {
                id = f.Id,
                code = f.Code,
                nom = f.Nom,
                designation = f.Description,
                groupeId = f.GroupeId
            })
            .ToListAsync();

        var sousFamilles = await _db.SousFamillesEquipements.AsNoTracking()
            .OrderBy(sf => sf.Nom)
            .Select(sf => new
            {
                id = sf.Id,
                code = sf.Code,
                nom = sf.Nom,
                designation = sf.Description,
                familleId = sf.FamilleId,
                groupeId = sf.GroupeId
            })
            .ToListAsync();

        var equipements = await _db.Equipements.AsNoTracking()
            .Where(eq => eq.ServiceId != null
                && _db.Services.Any(service => service.Id == eq.ServiceId
                    && _db.Departements.Any(dep => dep.Id == service.DepartementId
                        && _db.Divisions.Any(div => div.Id == dep.DivisionId
                            && _db.Unites.Any(unite => unite.Id == div.UniteId && unite.EntrepriseId == resolvedEntrepriseId)))))
            .OrderBy(eq => eq.Nom)
            .Select(eq => new
            {
                id = eq.Id,
                code = eq.Code ?? eq.Tag,
                nom = eq.Nom,
                criticite = string.IsNullOrWhiteSpace(eq.Criticite) ? "1" : eq.Criticite,
                statut = string.IsNullOrWhiteSpace(eq.Statut) ? "En service" : eq.Statut,
                serviceId = eq.ServiceId,
                serviceNom = _db.Services.Where(service => service.Id == eq.ServiceId).Select(service => service.Nom).FirstOrDefault(),
                groupeId = eq.GroupeId,
                groupeNom = eq.GroupeNom,
                familleId = eq.FamilleId,
                familleNom = eq.FamilleNom,
                sousFamilleId = eq.SousFamilleId,
                sousFamilleNom = eq.SousFamilleNom,
                localisation = _db.Services.Where(service => service.Id == eq.ServiceId)
                    .Select(service => service.Nom)
                    .FirstOrDefault()
            })
            .ToListAsync();

        object BuildEquipmentNode(dynamic eq) => new
        {
            type = "equipement",
            id = eq.id,
            code = eq.code,
            nom = eq.nom,
            criticite = eq.criticite,
            statut = eq.statut,
            serviceId = eq.serviceId,
            serviceNom = eq.serviceNom,
            groupeId = eq.groupeId,
            groupeNom = eq.groupeNom,
            familleId = eq.familleId,
            familleNom = eq.familleNom,
            sousFamilleId = eq.sousFamilleId,
            sousFamilleNom = eq.sousFamilleNom,
            localisation = eq.localisation,
            children = Array.Empty<object>()
        };

        object BuildSousFamilleNode(dynamic sousFamille, dynamic famille, dynamic groupe)
        {
            var equipmentChildren = equipements
                .Where(eq => eq.sousFamilleId == sousFamille.id)
                .Select(eq => BuildEquipmentNode(eq))
                .ToList();

            return new
            {
                type = "sousFamilleEquip",
                id = sousFamille.id,
                code = sousFamille.code,
                nom = sousFamille.nom,
                designation = sousFamille.designation,
                groupeId = sousFamille.groupeId,
                groupeNom = groupe.nom,
                familleId = sousFamille.familleId,
                familleNom = famille.nom,
                children = equipmentChildren
            };
        }

        object BuildFamilleNode(dynamic famille, dynamic groupe)
        {
            var subFamilyChildren = sousFamilles
                .Where(sousFamille => sousFamille.familleId == famille.id)
                .Select(sousFamille => BuildSousFamilleNode(sousFamille, famille, groupe))
                .ToList();

            var directEquipmentChildren = equipements
                .Where(eq => eq.familleId == famille.id && string.IsNullOrWhiteSpace(eq.sousFamilleId))
                .Select(eq => BuildEquipmentNode(eq))
                .ToList();

            return new
            {
                type = "familleEquip",
                id = famille.id,
                code = famille.code,
                nom = famille.nom,
                designation = famille.designation,
                groupeId = famille.groupeId,
                groupeNom = groupe.nom,
                children = subFamilyChildren.Concat(directEquipmentChildren).ToList()
            };
        }

        var tree = groupes
            .Select(groupe =>
            {
                var familyChildren = familles
                    .Where(famille => famille.groupeId == groupe.id)
                    .Select(famille => BuildFamilleNode(famille, groupe))
                    .ToList();

                var directEquipmentChildren = equipements
                    .Where(eq => eq.groupeId == groupe.id && string.IsNullOrWhiteSpace(eq.familleId))
                    .Select(eq => BuildEquipmentNode(eq))
                    .ToList();

                return new
                {
                    type = "groupeEquip",
                    id = groupe.id,
                    code = groupe.code,
                    nom = groupe.nom,
                    designation = groupe.designation,
                    children = familyChildren.Concat(directEquipmentChildren).ToList()
                };
            })
            .Cast<object>()
            .Concat(
                equipements
                    .Where(eq => string.IsNullOrWhiteSpace(eq.groupeId))
                    .Select(eq => BuildEquipmentNode(eq)))
            .ToList();

        return new JsonResult(tree) { StatusCode = 200 };
    }

    public async Task<JsonResult> OnGetUnitesAsync(string entrepriseId)
    {
        var resolvedEntrepriseId = ResolveEntrepriseId(entrepriseId);
        if (string.IsNullOrWhiteSpace(resolvedEntrepriseId))
        {
            return new JsonResult(Array.Empty<object>()) { StatusCode = 200 };
        }

        var data = await _db.Unites.AsNoTracking()
            .Where(u => u.EntrepriseId == resolvedEntrepriseId)
            .OrderBy(u => u.Nom)
            .Select(u => new
            {
                id = u.Id,
                code = u.Code,
                nom = u.Nom,
                wilaya = u.Wilaya,
                daira = u.Daira,
                commune = u.Commune,
                adresse = u.Adresse,
                directeur = u.Directeur,
                telephone = u.Telephone,
                email = u.Email,
                description = u.Description,
                entrepriseId = u.EntrepriseId
            })
            .ToListAsync();

        return new JsonResult(data) { StatusCode = 200 };
    }

    public async Task<JsonResult> OnGetDivisionsAsync(string entrepriseId)
    {
        var resolvedEntrepriseId = ResolveEntrepriseId(entrepriseId);
        if (string.IsNullOrWhiteSpace(resolvedEntrepriseId))
        {
            return new JsonResult(Array.Empty<object>()) { StatusCode = 200 };
        }

        var data = await _db.Divisions.AsNoTracking()
            .Where(d => _db.Unites.Any(u => u.Id == d.UniteId && u.EntrepriseId == resolvedEntrepriseId))
            .OrderBy(d => d.Nom)
            .Select(d => new
            {
                id = d.Id,
                code = d.Code,
                nom = d.Nom,
                responsable = d.Responsable,
                telephone = d.Telephone,
                email = d.Email,
                description = d.Description,
                uniteId = d.UniteId,
                uniteName = _db.Unites.Where(u => u.Id == d.UniteId).Select(u => u.Nom).FirstOrDefault()
            })
            .ToListAsync();

        return new JsonResult(data) { StatusCode = 200 };
    }

    public async Task<JsonResult> OnGetDepartementsAsync(string entrepriseId)
    {
        var resolvedEntrepriseId = ResolveEntrepriseId(entrepriseId);
        if (string.IsNullOrWhiteSpace(resolvedEntrepriseId))
        {
            return new JsonResult(Array.Empty<object>()) { StatusCode = 200 };
        }

        var data = await _db.Departements.AsNoTracking()
            .Where(dep => _db.Divisions.Any(div => div.Id == dep.DivisionId && _db.Unites.Any(u => u.Id == div.UniteId && u.EntrepriseId == resolvedEntrepriseId)))
            .OrderBy(dep => dep.Nom)
            .Select(dep => new
            {
                id = dep.Id,
                code = dep.Code,
                nom = dep.Nom,
                chef = dep.Chef,
                telephone = dep.Telephone,
                email = dep.Email,
                description = dep.Description,
                divisionId = dep.DivisionId,
                divisionName = _db.Divisions.Where(d => d.Id == dep.DivisionId).Select(d => d.Nom).FirstOrDefault()
            })
            .ToListAsync();

        return new JsonResult(data) { StatusCode = 200 };
    }

    public async Task<JsonResult> OnGetServicesAsync(string entrepriseId)
    {
        var resolvedEntrepriseId = ResolveEntrepriseId(entrepriseId);
        if (string.IsNullOrWhiteSpace(resolvedEntrepriseId))
        {
            return new JsonResult(Array.Empty<object>()) { StatusCode = 200 };
        }

        var data = await _db.Services.AsNoTracking()
            .Where(service => _db.Departements.Any(dep => dep.Id == service.DepartementId && _db.Divisions.Any(div => div.Id == dep.DivisionId && _db.Unites.Any(u => u.Id == div.UniteId && u.EntrepriseId == resolvedEntrepriseId))))
            .OrderBy(service => service.Nom)
            .Select(service => new
            {
                id = service.Id,
                code = service.Code,
                nom = service.Nom,
                chef = service.Chef,
                telephone = service.Telephone,
                email = service.Email,
                description = service.Description,
                departementId = service.DepartementId,
                departementName = _db.Departements.Where(d => d.Id == service.DepartementId).Select(d => d.Nom).FirstOrDefault()
            })
            .ToListAsync();

        return new JsonResult(data) { StatusCode = 200 };
    }
    public async Task<IActionResult> OnGetEquipementsAsync(string entrepriseId)
    {
        var resolvedEntrepriseId = ResolveEntrepriseId(entrepriseId);
        if (string.IsNullOrWhiteSpace(resolvedEntrepriseId))
        {
            return new JsonResult(Array.Empty<object>()) { StatusCode = 200 };
        }

        var rawData = await _db.Equipements.AsNoTracking()
            .Where(eq => eq.ServiceId != null
                && _db.Services.Any(service => service.Id == eq.ServiceId
                    && _db.Departements.Any(dep => dep.Id == service.DepartementId
                        && _db.Divisions.Any(div => div.Id == dep.DivisionId
                            && _db.Unites.Any(unite => unite.Id == div.UniteId && unite.EntrepriseId == resolvedEntrepriseId)))))
            .OrderBy(eq => eq.Nom)
            .Select(eq => new
            {
                id = eq.Id,
                code = eq.Code,
                tag = eq.Tag,
                nom = eq.Nom,
                marque = eq.Marque,
                fournisseur = eq.Fournisseur,
                numeroSerie = eq.NumeroSerie,
                dateAchat = eq.DateAchat,
                prixAchat = eq.PrixAchat,
                dateMiseEnService = eq.DateMiseEnService,
                periodeGarantie = eq.PeriodeGarantie,
                periodeGarantieUnite = eq.PeriodeGarantieUnite,
                criticite = eq.Criticite,
                statut = eq.Statut,
                notes = eq.Notes,
                photo = eq.Photo,
                documentsJson = eq.DocumentsJson,
                groupeId = eq.GroupeId,
                groupeNom = eq.GroupeNom,
                familleId = eq.FamilleId,
                familleNom = eq.FamilleNom,
                sousFamilleId = eq.SousFamilleId,
                sousFamilleNom = eq.SousFamilleNom,
                serviceId = eq.ServiceId,
                serviceNom = _db.Services.Where(s => s.Id == eq.ServiceId).Select(s => s.Nom).FirstOrDefault()
            })
            .ToListAsync();

        var data = rawData.Select(eq => new
        {
            eq.id,
            eq.code,
            eq.tag,
            eq.nom,
            eq.marque,
            eq.fournisseur,
            eq.numeroSerie,
            eq.dateAchat,
            eq.prixAchat,
            eq.dateMiseEnService,
            eq.periodeGarantie,
            eq.periodeGarantieUnite,
            criticite = string.IsNullOrWhiteSpace(eq.criticite) ? "1" : eq.criticite,
            statut = string.IsNullOrWhiteSpace(eq.statut) ? "En service" : eq.statut,
            eq.notes,
            eq.photo,
            documents = string.IsNullOrWhiteSpace(eq.documentsJson)
                ? new List<DocumentDto>()
                : JsonSerializer.Deserialize<List<DocumentDto>>(eq.documentsJson) ?? new List<DocumentDto>(),
            eq.groupeId,
            eq.groupeNom,
            eq.familleId,
            eq.familleNom,
            eq.sousFamilleId,
            eq.sousFamilleNom,
            eq.serviceId,
            eq.serviceNom
        });

        return new JsonResult(data) { StatusCode = 200 };
    }

    public async Task<JsonResult> OnGetOrganesAsync(string entrepriseId)
    {
        var resolvedEntrepriseId = ResolveEntrepriseId(entrepriseId);
        if (string.IsNullOrWhiteSpace(resolvedEntrepriseId))
        {
            return new JsonResult(Array.Empty<object>()) { StatusCode = 200 };
        }

        var rawData = await _db.Organes.AsNoTracking()
            .Where(org => org.EquipementId != null
                && _db.Equipements.Any(eq => eq.Id == org.EquipementId
                    && _db.Services.Any(service => service.Id == eq.ServiceId
                        && _db.Departements.Any(dep => dep.Id == service.DepartementId
                            && _db.Divisions.Any(div => div.Id == dep.DivisionId
                                && _db.Unites.Any(unite => unite.Id == div.UniteId && unite.EntrepriseId == resolvedEntrepriseId))))))
            .OrderBy(org => org.Nom)
            .Select(org => new
            {
                id = org.Id,
                code = org.Code,
                nom = org.Nom,
                groupeId = org.GroupeId,
                groupeNom = org.GroupeNom,
                familleId = org.FamilleId,
                familleNom = org.FamilleNom,
                sousFamilleId = org.SousFamilleId,
                sousFamilleNom = org.SousFamilleNom,
                equipementId = org.EquipementId,
                equipementNom = org.EquipementNom ?? _db.Equipements.Where(eq => eq.Id == org.EquipementId).Select(eq => eq.Nom).FirstOrDefault(),
                equipementCode = org.EquipementCode ?? _db.Equipements.Where(eq => eq.Id == org.EquipementId).Select(eq => eq.Code).FirstOrDefault(),
                marque = org.Marque,
                reference = org.Reference,
                fournisseur = org.Fournisseur,
                dateInstallation = org.DateInstallation,
                dateRemplacement = org.DateRemplacement,
                dureeVie = org.DureeVie,
                dureeVieUnite = org.DureeVieUnite,
                prixUnitaire = org.PrixUnitaire,
                periodeGarantie = org.PeriodeGarantie,
                periodeGarantieUnite = org.PeriodeGarantieUnite,
                statut = org.Statut,
                positionSurEquipement = org.PositionSurEquipement,
                descriptionTechnique = org.DescriptionTechnique,
                photo = org.Photo,
                documentsJson = org.DocumentsJson,
                notes = org.Notes
            })
            .ToListAsync();

        var data = rawData.Select(org => new
        {
            org.id,
            org.code,
            org.nom,
            org.groupeId,
            org.groupeNom,
            org.familleId,
            org.familleNom,
            org.sousFamilleId,
            org.sousFamilleNom,
            org.equipementId,
            org.equipementNom,
            org.equipementCode,
            org.marque,
            org.reference,
            org.fournisseur,
            org.dateInstallation,
            org.dateRemplacement,
            org.dureeVie,
            org.dureeVieUnite,
            org.prixUnitaire,
            org.periodeGarantie,
            org.periodeGarantieUnite,
            statut = string.IsNullOrWhiteSpace(org.statut) ? "En service" : org.statut,
            org.positionSurEquipement,
            org.descriptionTechnique,
            org.photo,
            documents = string.IsNullOrWhiteSpace(org.documentsJson)
                ? new List<DocumentDto>()
                : JsonSerializer.Deserialize<List<DocumentDto>>(org.documentsJson) ?? new List<DocumentDto>(),
            org.notes
        });

        return new JsonResult(data) { StatusCode = 200 };
    }

    public async Task<JsonResult> OnGetArticlesAsync(string entrepriseId)
    {
        var resolvedEntrepriseId = ResolveEntrepriseId(entrepriseId);
        if (string.IsNullOrWhiteSpace(resolvedEntrepriseId))
        {
            return new JsonResult(Array.Empty<object>()) { StatusCode = 200 };
        }

        var rawData = await _db.Articles.AsNoTracking()
            .Where(article => article.EntrepriseId == resolvedEntrepriseId)
            .OrderBy(article => article.Designation)
            .Select(article => new
            {
                id = article.Id,
                code = article.Code,
                nom = article.Nom,
                designation = article.Designation,
                referenceInterne = article.ReferenceInterne,
                referenceFabricant = article.ReferenceFabricant,
                marque = article.Marque,
                fournisseur = article.Fournisseur,
                type = article.Type,
                uniteMesure = article.UniteMesure,
                stockActuel = article.StockActuel,
                emplacementStock = article.EmplacementStock,
                stockMinimum = article.StockMinimum,
                stockCritique = article.StockCritique,
                qteReapprovisionnement = article.QteReapprovisionnement,
                prixUnitaire = article.PrixUnitaire,
                valeurTotale = article.ValeurTotale,
                dateInventaire = article.DateInventaire,
                dateDernierMouvement = article.DateDernierMouvement,
                photo = article.Photo,
                documentsJson = article.DocumentsJson,
                notes = article.Notes,
                groupeId = article.GroupeId,
                groupeNom = article.GroupeNom,
                familleId = article.FamilleId,
                familleNom = article.FamilleNom,
                sousFamilleId = article.SousFamilleId,
                sousFamilleNom = article.SousFamilleNom,
                organeLinksJson = article.OrganeLinksJson
            })
            .ToListAsync();

        var data = rawData.Select(article => new
        {
            article.id,
            article.code,
            nom = string.IsNullOrWhiteSpace(article.nom) ? article.designation : article.nom,
            article.designation,
            article.referenceInterne,
            article.referenceFabricant,
            article.marque,
            article.fournisseur,
            article.type,
            article.uniteMesure,
            article.stockActuel,
            article.emplacementStock,
            article.stockMinimum,
            article.stockCritique,
            article.qteReapprovisionnement,
            article.prixUnitaire,
            article.valeurTotale,
            article.dateInventaire,
            article.dateDernierMouvement,
            article.photo,
            documents = string.IsNullOrWhiteSpace(article.documentsJson)
                ? new List<DocumentDto>()
                : JsonSerializer.Deserialize<List<DocumentDto>>(article.documentsJson) ?? new List<DocumentDto>(),
            article.notes,
            article.groupeId,
            article.groupeNom,
            article.familleId,
            article.familleNom,
            article.sousFamilleId,
            article.sousFamilleNom,
            organeLinks = string.IsNullOrWhiteSpace(article.organeLinksJson)
                ? new List<ArticleOrganeLinkDto>()
                : JsonSerializer.Deserialize<List<ArticleOrganeLinkDto>>(article.organeLinksJson) ?? new List<ArticleOrganeLinkDto>()
        });

        return new JsonResult(data) { StatusCode = 200 };
    }

    public async Task<JsonResult> OnGetGroupesEquipementsAsync(string entrepriseId)
    {
        var data = await _db.GroupesEquipements.AsNoTracking()
            .OrderBy(g => g.Nom)
            .Select(g => new
            {
                id = g.Id,
                code = g.Code,
                nom = g.Nom,
                designation = g.Description
            })
            .ToListAsync();

        return new JsonResult(data) { StatusCode = 200 };
    }

    public async Task<JsonResult> OnGetFamillesEquipementsAsync(string entrepriseId)
    {
        var data = await _db.FamillesEquipements.AsNoTracking()
            .OrderBy(f => f.Nom)
            .Select(f => new
            {
                id = f.Id,
                code = f.Code,
                nom = f.Nom,
                designation = f.Description,
                groupeId = f.GroupeId,
                groupeNom = _db.GroupesEquipements.Where(g => g.Id == f.GroupeId).Select(g => g.Nom).FirstOrDefault()
            })
            .ToListAsync();

        return new JsonResult(data) { StatusCode = 200 };
    }

    public async Task<JsonResult> OnGetSousFamillesEquipementsAsync(string entrepriseId)
    {
        var data = await _db.SousFamillesEquipements.AsNoTracking()
            .OrderBy(sf => sf.Nom)
            .Select(sf => new
            {
                id = sf.Id,
                code = sf.Code,
                nom = sf.Nom,
                designation = sf.Description,
                familleId = sf.FamilleId,
                familleNom = _db.FamillesEquipements.Where(f => f.Id == sf.FamilleId).Select(f => f.Nom).FirstOrDefault(),
                groupeId = sf.GroupeId,
                groupeNom = _db.GroupesEquipements.Where(g => g.Id == sf.GroupeId).Select(g => g.Nom).FirstOrDefault()
            })
            .ToListAsync();

        return new JsonResult(data) { StatusCode = 200 };
    }

    public async Task<JsonResult> OnGetGroupesOrganesAsync(string entrepriseId)
    {
        var data = await _db.GroupesOrganes.AsNoTracking()
            .OrderBy(g => g.Nom)
            .Select(g => new { id = g.Id, code = g.Code, nom = g.Nom, designation = g.Description })
            .ToListAsync();

        return new JsonResult(data) { StatusCode = 200 };
    }

    public async Task<JsonResult> OnGetFamillesOrganesAsync(string entrepriseId)
    {
        var data = await _db.FamillesOrganes.AsNoTracking()
            .OrderBy(f => f.Nom)
            .Select(f => new
            {
                id = f.Id,
                code = f.Code,
                nom = f.Nom,
                designation = f.Description,
                groupeId = f.GroupeId,
                groupeNom = _db.GroupesOrganes.Where(g => g.Id == f.GroupeId).Select(g => g.Nom).FirstOrDefault()
            })
            .ToListAsync();

        return new JsonResult(data) { StatusCode = 200 };
    }

    public async Task<JsonResult> OnGetSousFamillesOrganesAsync(string entrepriseId)
    {
        var data = await _db.SousFamillesOrganes.AsNoTracking()
            .OrderBy(sf => sf.Nom)
            .Select(sf => new
            {
                id = sf.Id,
                code = sf.Code,
                nom = sf.Nom,
                designation = sf.Description,
                familleId = sf.FamilleId,
                familleNom = _db.FamillesOrganes.Where(f => f.Id == sf.FamilleId).Select(f => f.Nom).FirstOrDefault(),
                groupeId = sf.GroupeId,
                groupeNom = _db.GroupesOrganes.Where(g => g.Id == sf.GroupeId).Select(g => g.Nom).FirstOrDefault()
            })
            .ToListAsync();

        return new JsonResult(data) { StatusCode = 200 };
    }

    public async Task<JsonResult> OnGetGroupesArticlesAsync(string entrepriseId)
    {
        var data = await _db.GroupesArticles.AsNoTracking()
            .OrderBy(g => g.Nom)
            .Select(g => new { id = g.Id, code = g.Code, nom = g.Nom, designation = g.Description })
            .ToListAsync();

        return new JsonResult(data) { StatusCode = 200 };
    }

    public async Task<JsonResult> OnGetFamillesArticlesAsync(string entrepriseId)
    {
        var data = await _db.FamillesArticles.AsNoTracking()
            .OrderBy(f => f.Nom)
            .Select(f => new
            {
                id = f.Id,
                code = f.Code,
                nom = f.Nom,
                designation = f.Description,
                groupeId = f.GroupeId,
                groupeNom = _db.GroupesArticles.Where(g => g.Id == f.GroupeId).Select(g => g.Nom).FirstOrDefault()
            })
            .ToListAsync();

        return new JsonResult(data) { StatusCode = 200 };
    }

    public async Task<JsonResult> OnGetSousFamillesArticlesAsync(string entrepriseId)
    {
        var data = await _db.SousFamillesArticles.AsNoTracking()
            .OrderBy(sf => sf.Nom)
            .Select(sf => new
            {
                id = sf.Id,
                code = sf.Code,
                nom = sf.Nom,
                designation = sf.Description,
                familleId = sf.FamilleId,
                familleNom = _db.FamillesArticles.Where(f => f.Id == sf.FamilleId).Select(f => f.Nom).FirstOrDefault(),
                groupeId = sf.GroupeId,
                groupeNom = _db.GroupesArticles.Where(g => g.Id == sf.GroupeId).Select(g => g.Nom).FirstOrDefault()
            })
            .ToListAsync();

        return new JsonResult(data) { StatusCode = 200 };
    }

    public Task<JsonResult> OnGetMouvementsAsync(string entrepriseId)
        => Task.FromResult(new JsonResult(Array.Empty<object>()) { StatusCode = 200 });

    public Task<JsonResult> OnGetCommandesAsync(string entrepriseId)
        => Task.FromResult(new JsonResult(Array.Empty<object>()) { StatusCode = 200 });

    public Task<JsonResult> OnGetFournisseursAsync(string entrepriseId)
        => Task.FromResult(new JsonResult(Array.Empty<object>()) { StatusCode = 200 });

    public Task<JsonResult> OnGetInterventionsAsync(string entrepriseId)
        => Task.FromResult(new JsonResult(Array.Empty<object>()) { StatusCode = 200 });

    public async Task<JsonResult> OnPostSaveUniteAsync([FromBody] UniteRequest request)
    {
        var entrepriseId = ResolveEntrepriseId(request.EntrepriseId);
        if (string.IsNullOrWhiteSpace(entrepriseId))
        {
            return ErrorResult("Entreprise invalide.");
        }

        if (!ValidateUnite(request, out var validationError))
        {
            return ErrorResult(validationError);
        }

        var unite = string.IsNullOrWhiteSpace(request.Id)
            ? new Unite { EntrepriseId = entrepriseId }
            : await _db.Unites.FirstOrDefaultAsync(u => u.Id == request.Id && u.EntrepriseId == entrepriseId);

        if (unite is null)
        {
            return ErrorResult("Unit� introuvable.");
        }

        unite.Code = NormalizeOrFallback(request.Code, "UNT-");
        unite.Nom = request.Nom.Trim();
        unite.Wilaya = request.Wilaya.Trim();
        unite.Daira = request.Daira.Trim();
        unite.Commune = request.Commune.Trim();
        unite.Adresse = NormalizeOptional(request.Adresse);
        unite.Directeur = request.Directeur.Trim();
        unite.Telephone = request.Telephone.Trim();
        unite.Email = request.Email.Trim();
        unite.Description = NormalizeOptional(request.Description);

        if (string.IsNullOrWhiteSpace(request.Id))
        {
            _db.Unites.Add(unite);
        }

        await _db.SaveChangesAsync();
        return SuccessResult();
    }

    public async Task<JsonResult> OnPostSaveGroupeEquipementAsync([FromBody] GroupeEquipementRequest request)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.Nom))
            return ErrorResult("Requ�te invalide.");

        GroupeEquipement groupe = null;
        if (!string.IsNullOrWhiteSpace(request.Id))
        {
            groupe = await _db.GroupesEquipements.FirstOrDefaultAsync(g => g.Id == request.Id);
            if (groupe is null) return ErrorResult("Groupe introuvable.");
        }

        groupe ??= new GroupeEquipement();
        groupe.Code = NormalizeOrFallback(request.Code, "GRP-EQ");
        groupe.Nom = request.Nom.Trim();
        groupe.Description = NormalizeOptional(request.Description);

        if (string.IsNullOrWhiteSpace(request.Id)) _db.GroupesEquipements.Add(groupe);
        await _db.SaveChangesAsync();

        return new JsonResult(new { success = true, item = new { id = groupe.Id, code = groupe.Code, nom = groupe.Nom } });
    }

    public async Task<JsonResult> OnPostSaveFamilleEquipementAsync([FromBody] FamilleEquipementRequest request)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.Nom))
            return ErrorResult("Requ�te invalide.");

        if (!string.IsNullOrWhiteSpace(request.GroupeId))
        {
            var grp = await _db.GroupesEquipements.FindAsync(request.GroupeId);
            if (grp is null) return ErrorResult("Groupe parent invalide.");
        }

        FamilleEquipement fam = null;
        if (!string.IsNullOrWhiteSpace(request.Id))
        {
            fam = await _db.FamillesEquipements.FirstOrDefaultAsync(f => f.Id == request.Id);
            if (fam is null) return ErrorResult("Famille introuvable.");
        }

        fam ??= new FamilleEquipement();
        fam.Code = NormalizeOrFallback(request.Code, "FAM-EQ");
        fam.Nom = request.Nom.Trim();
        fam.Description = NormalizeOptional(request.Description);
        fam.GroupeId = NormalizeOptional(request.GroupeId);

        if (string.IsNullOrWhiteSpace(request.Id)) _db.FamillesEquipements.Add(fam);
        await _db.SaveChangesAsync();

        return new JsonResult(new { success = true, item = new { id = fam.Id, code = fam.Code, nom = fam.Nom, groupeId = fam.GroupeId } });
    }

    public async Task<JsonResult> OnPostSaveSousFamilleEquipementAsync([FromBody] SousFamilleEquipementRequest request)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.Nom))
            return ErrorResult("Requ�te invalide.");

        if (!string.IsNullOrWhiteSpace(request.FamilleId))
        {
            var fam = await _db.FamillesEquipements.FindAsync(request.FamilleId);
            if (fam is null) return ErrorResult("Famille parent invalide.");
        }

        SousFamilleEquipement sf = null;
        if (!string.IsNullOrWhiteSpace(request.Id))
        {
            sf = await _db.SousFamillesEquipements.FirstOrDefaultAsync(s => s.Id == request.Id);
            if (sf is null) return ErrorResult("Sous-famille introuvable.");
        }

        sf ??= new SousFamilleEquipement();
        sf.Code = NormalizeOrFallback(request.Code, "SFA-EQ");
        sf.Nom = request.Nom.Trim();
        sf.Description = NormalizeOptional(request.Description);
        sf.FamilleId = NormalizeOptional(request.FamilleId);
        sf.GroupeId = NormalizeOptional(request.GroupeId);

        if (string.IsNullOrWhiteSpace(request.Id)) _db.SousFamillesEquipements.Add(sf);
        await _db.SaveChangesAsync();

        return new JsonResult(new { success = true, item = new { id = sf.Id, code = sf.Code, nom = sf.Nom, familleId = sf.FamilleId } });
    }

    // Organe groups
    public async Task<JsonResult> OnPostSaveGroupeOrganeAsync([FromBody] GroupeOrganeRequest request)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.Nom)) return ErrorResult("Requ�te invalide.");
        GroupeOrgane g = null;
        if (!string.IsNullOrWhiteSpace(request.Id))
        {
            g = await _db.GroupesOrganes.FirstOrDefaultAsync(x => x.Id == request.Id);
            if (g is null) return ErrorResult("Groupe introuvable.");
        }
        g ??= new GroupeOrgane();
        g.Code = NormalizeOrFallback(request.Code, "GRP-ORG");
        g.Nom = request.Nom.Trim();
        g.Description = NormalizeOptional(request.Description);
        if (string.IsNullOrWhiteSpace(request.Id)) _db.GroupesOrganes.Add(g);
        await _db.SaveChangesAsync();
        return new JsonResult(new { success = true, item = new { id = g.Id, code = g.Code, nom = g.Nom } });
    }

    public async Task<JsonResult> OnPostSaveFamilleOrganeAsync([FromBody] FamilleOrganeRequest request)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.Nom)) return ErrorResult("Requ�te invalide.");
        if (!string.IsNullOrWhiteSpace(request.GroupeId) && await _db.GroupesOrganes.FindAsync(request.GroupeId) is null)
            return ErrorResult("Groupe parent invalide.");
        FamilleOrgane f = null;
        if (!string.IsNullOrWhiteSpace(request.Id))
        {
            f = await _db.FamillesOrganes.FirstOrDefaultAsync(x => x.Id == request.Id);
            if (f is null) return ErrorResult("Famille introuvable.");
        }
        f ??= new FamilleOrgane();
        f.Code = NormalizeOrFallback(request.Code, "FAM-ORG");
        f.Nom = request.Nom.Trim();
        f.Description = NormalizeOptional(request.Description);
        f.GroupeId = NormalizeOptional(request.GroupeId);
        if (string.IsNullOrWhiteSpace(request.Id)) _db.FamillesOrganes.Add(f);
        await _db.SaveChangesAsync();
        return new JsonResult(new { success = true, item = new { id = f.Id, code = f.Code, nom = f.Nom, groupeId = f.GroupeId } });
    }

    public async Task<JsonResult> OnPostSaveSousFamilleOrganeAsync([FromBody] SousFamilleOrganeRequest request)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.Nom)) return ErrorResult("Requ�te invalide.");
        if (!string.IsNullOrWhiteSpace(request.FamilleId) && await _db.FamillesOrganes.FindAsync(request.FamilleId) is null)
            return ErrorResult("Famille parent invalide.");
        SousFamilleOrgane s = null;
        if (!string.IsNullOrWhiteSpace(request.Id))
        {
            s = await _db.SousFamillesOrganes.FirstOrDefaultAsync(x => x.Id == request.Id);
            if (s is null) return ErrorResult("Sous-famille introuvable.");
        }
        s ??= new SousFamilleOrgane();
        s.Code = NormalizeOrFallback(request.Code, "SFA-ORG");
        s.Nom = request.Nom.Trim();
        s.Description = NormalizeOptional(request.Description);
        s.FamilleId = NormalizeOptional(request.FamilleId);
        s.GroupeId = NormalizeOptional(request.GroupeId);
        if (string.IsNullOrWhiteSpace(request.Id)) _db.SousFamillesOrganes.Add(s);
        await _db.SaveChangesAsync();
        return new JsonResult(new { success = true, item = new { id = s.Id, code = s.Code, nom = s.Nom, familleId = s.FamilleId } });
    }

    // Article groups
    public async Task<JsonResult> OnPostSaveGroupeArticleAsync([FromBody] GroupeArticleRequest request)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.Nom)) return ErrorResult("Requ�te invalide.");
        GroupeArticle g = null;
        if (!string.IsNullOrWhiteSpace(request.Id))
        {
            g = await _db.GroupesArticles.FirstOrDefaultAsync(x => x.Id == request.Id);
            if (g is null) return ErrorResult("Groupe introuvable.");
        }
        g ??= new GroupeArticle();
        g.Code = NormalizeOrFallback(request.Code, "GRP-ART");
        g.Nom = request.Nom.Trim();
        g.Description = NormalizeOptional(request.Description);
        if (string.IsNullOrWhiteSpace(request.Id)) _db.GroupesArticles.Add(g);
        await _db.SaveChangesAsync();
        return new JsonResult(new { success = true, item = new { id = g.Id, code = g.Code, nom = g.Nom } });
    }

    public async Task<JsonResult> OnPostSaveFamilleArticleAsync([FromBody] FamilleArticleRequest request)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.Nom)) return ErrorResult("Requ�te invalide.");
        if (!string.IsNullOrWhiteSpace(request.GroupeId) && await _db.GroupesArticles.FindAsync(request.GroupeId) is null)
            return ErrorResult("Groupe parent invalide.");
        FamilleArticle f = null;
        if (!string.IsNullOrWhiteSpace(request.Id))
        {
            f = await _db.FamillesArticles.FirstOrDefaultAsync(x => x.Id == request.Id);
            if (f is null) return ErrorResult("Famille introuvable.");
        }
        f ??= new FamilleArticle();
        f.Code = NormalizeOrFallback(request.Code, "FAM-ART");
        f.Nom = request.Nom.Trim();
        f.Description = NormalizeOptional(request.Description);
        f.GroupeId = NormalizeOptional(request.GroupeId);
        if (string.IsNullOrWhiteSpace(request.Id)) _db.FamillesArticles.Add(f);
        await _db.SaveChangesAsync();
        return new JsonResult(new { success = true, item = new { id = f.Id, code = f.Code, nom = f.Nom, groupeId = f.GroupeId } });
    }

    public async Task<JsonResult> OnPostSaveSousFamilleArticleAsync([FromBody] SousFamilleArticleRequest request)
    {
        if (request is null || string.IsNullOrWhiteSpace(request.Nom)) return ErrorResult("Requ�te invalide.");
        if (!string.IsNullOrWhiteSpace(request.FamilleId) && await _db.FamillesArticles.FindAsync(request.FamilleId) is null)
            return ErrorResult("Famille parent invalide.");
        SousFamilleArticle s = null;
        if (!string.IsNullOrWhiteSpace(request.Id))
        {
            s = await _db.SousFamillesArticles.FirstOrDefaultAsync(x => x.Id == request.Id);
            if (s is null) return ErrorResult("Sous-famille introuvable.");
        }
        s ??= new SousFamilleArticle();
        s.Code = NormalizeOrFallback(request.Code, "SFA-ART");
        s.Nom = request.Nom.Trim();
        s.Description = NormalizeOptional(request.Description);
        s.FamilleId = NormalizeOptional(request.FamilleId);
        s.GroupeId = NormalizeOptional(request.GroupeId);
        if (string.IsNullOrWhiteSpace(request.Id)) _db.SousFamillesArticles.Add(s);
        await _db.SaveChangesAsync();
        return new JsonResult(new { success = true, item = new { id = s.Id, code = s.Code, nom = s.Nom, familleId = s.FamilleId } });
    }

    public async Task<JsonResult> OnPostSaveOrganeAsync([FromBody] OrganeRequest request)
    {
        if (request is null)
        {
            return ErrorResult("Requ�te invalide.");
        }

        var entrepriseId = ResolveEntrepriseId(request.EntrepriseId);
        if (string.IsNullOrWhiteSpace(entrepriseId))
        {
            return ErrorResult("Entreprise invalide.");
        }

        if (!ValidateOrgane(request, out var validationError))
        {
            return ErrorResult(validationError);
        }

        var equipement = await _db.Equipements.FirstOrDefaultAsync(eq => eq.Id == request.EquipementId
            && _db.Services.Any(service => service.Id == eq.ServiceId
                && _db.Departements.Any(dep => dep.Id == service.DepartementId
                    && _db.Divisions.Any(div => div.Id == dep.DivisionId
                        && _db.Unites.Any(unite => unite.Id == div.UniteId && unite.EntrepriseId == entrepriseId)))));
        if (equipement is null)
        {
            return ErrorResult("�quipement invalide.");
        }

        Organe? organe = null;
        if (!string.IsNullOrWhiteSpace(request.Id))
        {
            organe = await _db.Organes.FirstOrDefaultAsync(org => org.Id == request.Id
                && _db.Equipements.Any(eq => eq.Id == org.EquipementId
                    && _db.Services.Any(service => service.Id == eq.ServiceId
                        && _db.Departements.Any(dep => dep.Id == service.DepartementId
                            && _db.Divisions.Any(div => div.Id == dep.DivisionId
                                && _db.Unites.Any(unite => unite.Id == div.UniteId && unite.EntrepriseId == entrepriseId))))));
            if (organe is null)
            {
                return ErrorResult("Organe introuvable.");
            }
        }

        organe ??= new Organe();

        organe.Code = NormalizeOrFallback(request.Code, "ORG-");
        organe.Nom = request.Nom.Trim();
        organe.GroupeId = NormalizeOptional(request.GroupeId);
        organe.GroupeNom = NormalizeOptional(request.GroupeNom);
        organe.FamilleId = NormalizeOptional(request.FamilleId);
        organe.FamilleNom = NormalizeOptional(request.FamilleNom);
        organe.SousFamilleId = NormalizeOptional(request.SousFamilleId);
        organe.SousFamilleNom = NormalizeOptional(request.SousFamilleNom);
        organe.EquipementId = equipement.Id;
        organe.EquipementNom = equipement.Nom;
        organe.EquipementCode = equipement.Code;
        organe.Marque = NormalizeOptional(request.Marque);
        organe.Reference = NormalizeOptional(request.Reference);
        organe.Fournisseur = NormalizeOptional(request.Fournisseur);
        organe.DateInstallation = request.DateInstallation;
        organe.DateRemplacement = request.DateRemplacement;
        organe.DureeVie = request.DureeVie;
        organe.DureeVieUnite = NormalizeOptional(request.DureeVieUnite);
        organe.PrixUnitaire = request.PrixUnitaire;
        organe.PeriodeGarantie = request.PeriodeGarantie;
        organe.PeriodeGarantieUnite = NormalizeOptional(request.PeriodeGarantieUnite);
        organe.Statut = string.IsNullOrWhiteSpace(request.Statut) ? "En service" : request.Statut.Trim();
        organe.PositionSurEquipement = NormalizeOptional(request.PositionSurEquipement);
        organe.DescriptionTechnique = NormalizeOptional(request.DescriptionTechnique);
        organe.Photo = NormalizeOptional(request.Photo);
        organe.DocumentsJson = request.Documents is null || request.Documents.Count == 0
            ? null
            : JsonSerializer.Serialize(request.Documents);
        organe.Notes = NormalizeOptional(request.Notes);

        if (string.IsNullOrWhiteSpace(request.Id))
        {
            _db.Organes.Add(organe);
        }

        await _db.SaveChangesAsync();
        return SuccessResult();
    }

    public async Task<JsonResult> OnPostSaveDivisionAsync([FromBody] DivisionRequest request)
    {
        var entrepriseId = ResolveEntrepriseId(null);
        if (string.IsNullOrWhiteSpace(entrepriseId))
        {
            return ErrorResult("Entreprise invalide.");
        }

        if (!ValidateDivision(request, out var validationError))
        {
            return ErrorResult(validationError);
        }

        var unite = await _db.Unites.FirstOrDefaultAsync(u => u.Id == request.UniteId && u.EntrepriseId == entrepriseId);
        if (unite is null)
        {
            return ErrorResult("Unit� principale invalide.");
        }

        var division = string.IsNullOrWhiteSpace(request.Id)
            ? new Division { UniteId = unite.Id }
            : await _db.Divisions.FirstOrDefaultAsync(d => d.Id == request.Id && d.UniteId == unite.Id);

        if (division is null)
        {
            return ErrorResult("Division introuvable.");
        }

        division.Code = NormalizeOrFallback(request.Code, "DIV-");
        division.Nom = request.Nom.Trim();
        division.Responsable = request.Responsable.Trim();
        division.Telephone = request.Telephone.Trim();
        division.Email = request.Email.Trim();
        division.Description = NormalizeOptional(request.Description);

        if (string.IsNullOrWhiteSpace(request.Id))
        {
            _db.Divisions.Add(division);
        }

        await _db.SaveChangesAsync();
        return SuccessResult();
    }

    public async Task<JsonResult> OnPostSaveDepartementAsync([FromBody] DepartementRequest request)
    {
        var entrepriseId = ResolveEntrepriseId(null);
        if (string.IsNullOrWhiteSpace(entrepriseId))
        {
            return ErrorResult("Entreprise invalide.");
        }

        if (!ValidateDepartement(request, out var validationError))
        {
            return ErrorResult(validationError);
        }

        var division = await _db.Divisions.FirstOrDefaultAsync(d => d.Id == request.DivisionId && _db.Unites.Any(u => u.Id == d.UniteId && u.EntrepriseId == entrepriseId));
        if (division is null)
        {
            return ErrorResult("Division parente invalide.");
        }

        var departement = string.IsNullOrWhiteSpace(request.Id)
            ? new Departement { DivisionId = division.Id }
            : await _db.Departements.FirstOrDefaultAsync(d => d.Id == request.Id && d.DivisionId == division.Id);

        if (departement is null)
        {
            return ErrorResult("D�partement introuvable.");
        }

        departement.Code = NormalizeOrFallback(request.Code, "DEP-");
        departement.Nom = request.Nom.Trim();
        departement.Chef = request.Chef.Trim();
        departement.Telephone = request.Telephone.Trim();
        departement.Email = request.Email.Trim();
        departement.Description = NormalizeOptional(request.Description);

        if (string.IsNullOrWhiteSpace(request.Id))
        {
            _db.Departements.Add(departement);
        }

        await _db.SaveChangesAsync();
        return SuccessResult();
    }

    public async Task<JsonResult> OnPostSaveServiceAsync([FromBody] ServiceRequest request)
    {
        var entrepriseId = ResolveEntrepriseId(null);
        if (string.IsNullOrWhiteSpace(entrepriseId))
        {
            return ErrorResult("Entreprise invalide.");
        }

        if (!ValidateService(request, out var validationError))
        {
            return ErrorResult(validationError);
        }

        var departement = await _db.Departements.FirstOrDefaultAsync(d => d.Id == request.DepartementId && _db.Divisions.Any(div => div.Id == d.DivisionId && _db.Unites.Any(u => u.Id == div.UniteId && u.EntrepriseId == entrepriseId)));
        if (departement is null)
        {
            return ErrorResult("D�partement parent invalide.");
        }

        var service = string.IsNullOrWhiteSpace(request.Id)
            ? new Service { DepartementId = departement.Id }
            : await _db.Services.FirstOrDefaultAsync(s => s.Id == request.Id && s.DepartementId == departement.Id);

        if (service is null)
        {
            return ErrorResult("Service introuvable.");
        }

        service.Code = NormalizeOrFallback(request.Code, "SER-");
        service.Nom = request.Nom.Trim();
        service.Chef = request.Chef.Trim();
        service.Telephone = request.Telephone.Trim();
        service.Email = request.Email.Trim();
        service.Description = NormalizeOptional(request.Description);

        if (string.IsNullOrWhiteSpace(request.Id))
        {
            _db.Services.Add(service);
        }

        await _db.SaveChangesAsync();
        return SuccessResult();
    }
    public async Task<JsonResult> OnPostSaveEquipementAsync([FromBody] EquipementRequest request)
    {
        if (request is null)
        {
            return ErrorResult("Requ�te invalide.");
        }

        var entrepriseId = ResolveEntrepriseId(request.EntrepriseId);
        if (string.IsNullOrWhiteSpace(entrepriseId))
        {
            return ErrorResult("Entreprise invalide.");
        }

        if (!ValidateEquipement(request, out var validationError))
        {
            return ErrorResult(validationError);
        }

        var service = await _db.Services.FirstOrDefaultAsync(s => s.Id == request.ServiceId
            && _db.Departements.Any(dep => dep.Id == s.DepartementId
                && _db.Divisions.Any(div => div.Id == dep.DivisionId
                    && _db.Unites.Any(unite => unite.Id == div.UniteId && unite.EntrepriseId == entrepriseId))));
        if (service is null)
        {
            return ErrorResult("Service invalide.");
        }

        Equipement? equipement = null;
        if (!string.IsNullOrWhiteSpace(request.Id))
        {
            equipement = await _db.Equipements.FirstOrDefaultAsync(eq => eq.Id == request.Id
                && _db.Services.Any(s => s.Id == eq.ServiceId
                    && _db.Departements.Any(dep => dep.Id == s.DepartementId
                        && _db.Divisions.Any(div => div.Id == dep.DivisionId
                            && _db.Unites.Any(unite => unite.Id == div.UniteId && unite.EntrepriseId == entrepriseId)))));
            if (equipement is null)
            {
                return ErrorResult("�quipement introuvable.");
            }
        }

        equipement ??= new Equipement();

        equipement.Code = NormalizeOrFallback(request.Code, "EQP-");
        equipement.Tag = equipement.Code;
        equipement.Nom = request.Nom.Trim();
        equipement.Marque = string.IsNullOrWhiteSpace(request.Marque) ? string.Empty : request.Marque.Trim();
        equipement.Fournisseur = NormalizeOptional(request.Fournisseur);
        equipement.NumeroSerie = NormalizeOptional(request.NumeroSerie);
        equipement.DateAchat = request.DateAchat;
        equipement.PrixAchat = request.PrixAchat;
        equipement.DateMiseEnService = request.DateMiseEnService;
        equipement.PeriodeGarantie = request.PeriodeGarantie;
        equipement.PeriodeGarantieUnite = NormalizeOptional(request.PeriodeGarantieUnite);
        equipement.Criticite = string.IsNullOrWhiteSpace(request.Criticite) ? "1" : request.Criticite.Trim();
        equipement.Statut = string.IsNullOrWhiteSpace(request.Statut) ? "En service" : request.Statut.Trim();
        equipement.Notes = NormalizeOptional(request.Notes);
        equipement.Photo = NormalizeOptional(request.Photo);
        equipement.DocumentsJson = request.Documents is null || request.Documents.Count == 0
            ? null
            : JsonSerializer.Serialize(request.Documents);
        equipement.GroupeId = NormalizeOptional(request.GroupeId);
        equipement.FamilleId = NormalizeOptional(request.FamilleId);
        equipement.SousFamilleId = NormalizeOptional(request.SousFamilleId);
        equipement.ServiceId = service.Id;
        await ApplyEquipementClassificationAsync(equipement);

        if (string.IsNullOrWhiteSpace(request.Id))
        {
            var duplicateCode = await _db.Equipements.AsNoTracking().AnyAsync(eq => eq.Code == equipement.Code
                && eq.ServiceId != null
                && _db.Services.Any(s => s.Id == eq.ServiceId
                    && _db.Departements.Any(dep => dep.Id == s.DepartementId
                        && _db.Divisions.Any(div => div.Id == dep.DivisionId
                            && _db.Unites.Any(unite => unite.Id == div.UniteId && unite.EntrepriseId == entrepriseId)))));
            if (duplicateCode)
            {
                return ErrorResult("Un �quipement avec ce code existe d�j�.");
            }

            _db.Equipements.Add(equipement);
        }

        await _db.SaveChangesAsync();
        return new JsonResult(new { success = true, id = equipement.Id }) { StatusCode = 200 };
    }
    public async Task<JsonResult> OnPostSaveArticleAsync([FromBody] ArticleRequest request)
    {
        if (request is null)
        {
            return ErrorResult("Requ�te invalide.");
        }

        var entrepriseId = ResolveEntrepriseId(request.EntrepriseId);
        if (string.IsNullOrWhiteSpace(entrepriseId))
        {
            return ErrorResult("Entreprise invalide.");
        }

        if (!ValidateArticle(request, out var validationError))
        {
            return ErrorResult(validationError);
        }

        Article? article = null;
        if (!string.IsNullOrWhiteSpace(request.Id))
        {
            article = await _db.Articles.FirstOrDefaultAsync(a => a.Id == request.Id && a.EntrepriseId == entrepriseId);
            if (article is null)
            {
                return ErrorResult("Article introuvable.");
            }
        }

        article ??= new Article { EntrepriseId = entrepriseId };

        article.Code = NormalizeOrFallback(request.Code, "ART-");
        article.Designation = request.Designation.Trim();
        article.Nom = article.Designation;
        article.ReferenceInterne = NormalizeOptional(request.ReferenceInterne);
        article.ReferenceFabricant = NormalizeOptional(request.ReferenceFabricant);
        article.Marque = NormalizeOptional(request.Marque);
        article.Fournisseur = NormalizeOptional(request.Fournisseur);
        article.Type = NormalizeOptional(request.Type);
        article.UniteMesure = NormalizeOptional(request.UniteMesure);
        article.StockActuel = request.StockActuel;
        article.EmplacementStock = NormalizeOptional(request.EmplacementStock);
        article.StockMinimum = request.StockMinimum;
        article.StockCritique = request.StockCritique;
        article.QteReapprovisionnement = request.QteReapprovisionnement;
        article.PrixUnitaire = request.PrixUnitaire;
        article.ValeurTotale = request.ValeurTotale;
        article.DateInventaire = request.DateInventaire;
        article.DateDernierMouvement = request.DateDernierMouvement;
        article.Photo = NormalizeOptional(request.Photo);
        article.DocumentsJson = request.Documents is null || request.Documents.Count == 0
            ? null
            : JsonSerializer.Serialize(request.Documents);
        article.Notes = NormalizeOptional(request.Notes);
        article.GroupeId = NormalizeOptional(request.GroupeId);
        article.GroupeNom = NormalizeOptional(request.GroupeNom);
        article.FamilleId = NormalizeOptional(request.FamilleId);
        article.FamilleNom = NormalizeOptional(request.FamilleNom);
        article.SousFamilleId = NormalizeOptional(request.SousFamilleId);
        article.SousFamilleNom = NormalizeOptional(request.SousFamilleNom);
        article.OrganeLinksJson = request.OrganeLinks is null || request.OrganeLinks.Count == 0
            ? null
            : JsonSerializer.Serialize(request.OrganeLinks);
        if (request.OrganeLinks is not null && request.OrganeLinks.Count > 0)
        {
            var linkedOrganeId = request.OrganeLinks
                .Select(link => link.OrganeId)
                .FirstOrDefault(id => !string.IsNullOrWhiteSpace(id));
            if (!string.IsNullOrWhiteSpace(linkedOrganeId))
            {
                var linkedOrgane = await _db.Organes.AsNoTracking().FirstOrDefaultAsync(org => org.Id == linkedOrganeId);
                if (linkedOrgane is not null)
                {
                    article.EquipementId = linkedOrgane.EquipementId;
                }
            }
        }

        if (string.IsNullOrWhiteSpace(request.Id))
        {
            _db.Articles.Add(article);
        }

        await _db.SaveChangesAsync();
        return SuccessResult();
    }
    public Task<JsonResult> OnPostSaveMouvementAsync() => Task.FromResult(ErrorResult("Database layer reset."));
    public Task<JsonResult> OnPostSaveInterventionAsync() => Task.FromResult(ErrorResult("Database layer reset."));
    public Task<JsonResult> OnPostSaveCommandeAsync() => Task.FromResult(ErrorResult("Database layer reset."));

    public async Task<JsonResult> OnPostDeleteUniteAsync([FromBody] DeleteRequest request)
    {
        var entrepriseId = ResolveEntrepriseId(null);
        if (string.IsNullOrWhiteSpace(entrepriseId) || string.IsNullOrWhiteSpace(request.Id))
        {
            return ErrorResult("Suppression invalide.");
        }

        var unite = await _db.Unites.FirstOrDefaultAsync(u => u.Id == request.Id && u.EntrepriseId == entrepriseId);
        if (unite is null)
        {
            return ErrorResult("Unit� introuvable.");
        }

        _db.Unites.Remove(unite);
        await _db.SaveChangesAsync();
        return SuccessResult();
    }

    public async Task<JsonResult> OnPostDeleteDivisionAsync([FromBody] DeleteRequest request)
    {
        var entrepriseId = ResolveEntrepriseId(null);
        if (string.IsNullOrWhiteSpace(entrepriseId) || string.IsNullOrWhiteSpace(request.Id))
        {
            return ErrorResult("Suppression invalide.");
        }

        var division = await _db.Divisions.FirstOrDefaultAsync(d => d.Id == request.Id
            && _db.Unites.Any(u => u.Id == d.UniteId && u.EntrepriseId == entrepriseId));
        if (division is null)
        {
            return ErrorResult("Division introuvable.");
        }

        _db.Divisions.Remove(division);
        await _db.SaveChangesAsync();
        return SuccessResult();
    }

    public async Task<JsonResult> OnPostDeleteDepartementAsync([FromBody] DeleteRequest request)
    {
        var entrepriseId = ResolveEntrepriseId(null);
        if (string.IsNullOrWhiteSpace(entrepriseId) || string.IsNullOrWhiteSpace(request.Id))
        {
            return ErrorResult("Suppression invalide.");
        }

        var departement = await _db.Departements.FirstOrDefaultAsync(d => d.Id == request.Id
            && _db.Divisions.Any(div => div.Id == d.DivisionId
                && _db.Unites.Any(u => u.Id == div.UniteId && u.EntrepriseId == entrepriseId)));
        if (departement is null)
        {
            return ErrorResult("D�partement introuvable.");
        }

        _db.Departements.Remove(departement);
        await _db.SaveChangesAsync();
        return SuccessResult();
    }

    public async Task<JsonResult> OnPostDeleteServiceAsync([FromBody] DeleteRequest request)
    {
        var entrepriseId = ResolveEntrepriseId(null);
        if (string.IsNullOrWhiteSpace(entrepriseId) || string.IsNullOrWhiteSpace(request.Id))
        {
            return ErrorResult("Suppression invalide.");
        }

        var service = await _db.Services.FirstOrDefaultAsync(s => s.Id == request.Id
            && _db.Departements.Any(dep => dep.Id == s.DepartementId
                && _db.Divisions.Any(div => div.Id == dep.DivisionId
                    && _db.Unites.Any(u => u.Id == div.UniteId && u.EntrepriseId == entrepriseId))));
        if (service is null)
        {
            return ErrorResult("Service introuvable.");
        }

        _db.Services.Remove(service);
        await _db.SaveChangesAsync();
        return SuccessResult();
    }

    public async Task<JsonResult> OnPostDeleteGroupeEquipementAsync([FromBody] DeleteRequest request)
    {
        var requestKey = (request.Id ?? string.Empty).Trim().Replace("\u00A0", string.Empty);
        if (string.IsNullOrWhiteSpace(requestKey))
        {
            return ErrorResult("Suppression invalide.");
        }

        var entity = await _db.GroupesEquipements.FirstOrDefaultAsync(g => g.Id == requestKey || g.Code == requestKey);
        if (entity is null)
        {
            return ErrorResult("Groupe introuvable.");
        }

        try
        {
            var famillesIds = await _db.FamillesEquipements
                .Where(f => f.GroupeId == entity.Id)
                .Select(f => f.Id)
                .ToListAsync();

            var sousFamillesIds = await _db.SousFamillesEquipements
                .Where(sf => sf.GroupeId == entity.Id || famillesIds.Contains(sf.FamilleId!))
                .Select(sf => sf.Id)
                .ToListAsync();

            var equipementsToDelete = await _db.Equipements
                .Where(eq => eq.GroupeId == entity.Id
                    || famillesIds.Contains(eq.FamilleId!)
                    || sousFamillesIds.Contains(eq.SousFamilleId!))
                .ToListAsync();
            if (equipementsToDelete.Count > 0)
            {
                _db.Equipements.RemoveRange(equipementsToDelete);
            }

            var sousFamillesToDelete = await _db.SousFamillesEquipements
                .Where(sf => sf.GroupeId == entity.Id || famillesIds.Contains(sf.FamilleId!))
                .ToListAsync();
            if (sousFamillesToDelete.Count > 0)
            {
                _db.SousFamillesEquipements.RemoveRange(sousFamillesToDelete);
            }

            var famillesToDelete = await _db.FamillesEquipements
                .Where(f => f.GroupeId == entity.Id)
                .ToListAsync();
            if (famillesToDelete.Count > 0)
            {
                _db.FamillesEquipements.RemoveRange(famillesToDelete);
            }

            _db.GroupesEquipements.Remove(entity);
            await _db.SaveChangesAsync();
            return SuccessResult();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur suppression groupe equipement {GroupId}", requestKey);
            return ErrorResult("Suppression impossible: des éléments liés bloquent l'opération.");
        }
    }

    public async Task<JsonResult> OnPostDeleteFamilleEquipementAsync([FromBody] DeleteRequest request)
    {
        var requestKey = (request.Id ?? string.Empty).Trim().Replace("\u00A0", string.Empty);
        if (string.IsNullOrWhiteSpace(requestKey))
        {
            return ErrorResult("Suppression invalide.");
        }

        var entity = await _db.FamillesEquipements.FirstOrDefaultAsync(f => f.Id == requestKey || f.Code == requestKey);
        if (entity is null)
        {
            return ErrorResult("Famille introuvable.");
        }

        try
        {
            var sousFamillesIds = await _db.SousFamillesEquipements
                .Where(sf => sf.FamilleId == entity.Id)
                .Select(sf => sf.Id)
                .ToListAsync();

            var equipementsToDelete = await _db.Equipements
                .Where(eq => eq.FamilleId == entity.Id || sousFamillesIds.Contains(eq.SousFamilleId!))
                .ToListAsync();
            if (equipementsToDelete.Count > 0)
            {
                _db.Equipements.RemoveRange(equipementsToDelete);
            }

            var sousFamillesToDelete = await _db.SousFamillesEquipements
                .Where(sf => sf.FamilleId == entity.Id)
                .ToListAsync();
            if (sousFamillesToDelete.Count > 0)
            {
                _db.SousFamillesEquipements.RemoveRange(sousFamillesToDelete);
            }

            _db.FamillesEquipements.Remove(entity);
            await _db.SaveChangesAsync();
            return SuccessResult();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur suppression famille equipement {FamilleId}", requestKey);
            return ErrorResult("Suppression impossible: des éléments liés bloquent l'opération.");
        }
    }

    public async Task<JsonResult> OnPostDeleteSousFamilleEquipementAsync([FromBody] DeleteRequest request)
    {
        var requestKey = (request.Id ?? string.Empty).Trim().Replace("\u00A0", string.Empty);
        if (string.IsNullOrWhiteSpace(requestKey))
        {
            return ErrorResult("Suppression invalide.");
        }

        var entity = await _db.SousFamillesEquipements.FirstOrDefaultAsync(sf => sf.Id == requestKey || sf.Code == requestKey);
        if (entity is null)
        {
            return ErrorResult("Sous-famille introuvable.");
        }

        try
        {
            var equipementsToDelete = await _db.Equipements
                .Where(eq => eq.SousFamilleId == entity.Id)
                .ToListAsync();
            if (equipementsToDelete.Count > 0)
            {
                _db.Equipements.RemoveRange(equipementsToDelete);
            }

            _db.SousFamillesEquipements.Remove(entity);
            await _db.SaveChangesAsync();
            return SuccessResult();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erreur suppression sous-famille equipement {SousFamilleId}", requestKey);
            return ErrorResult("Suppression impossible: des éléments liés bloquent l'opération.");
        }
    }

    public async Task<JsonResult> OnPostDeleteGroupeOrganeAsync([FromBody] DeleteRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Id))
        {
            return ErrorResult("Suppression invalide.");
        }

        var entity = await _db.GroupesOrganes.FirstOrDefaultAsync(g => g.Id == request.Id);
        if (entity is null)
        {
            return ErrorResult("Groupe introuvable.");
        }

        _db.GroupesOrganes.Remove(entity);
        await _db.SaveChangesAsync();
        return SuccessResult();
    }

    public async Task<JsonResult> OnPostDeleteFamilleOrganeAsync([FromBody] DeleteRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Id))
        {
            return ErrorResult("Suppression invalide.");
        }

        var entity = await _db.FamillesOrganes.FirstOrDefaultAsync(f => f.Id == request.Id);
        if (entity is null)
        {
            return ErrorResult("Famille introuvable.");
        }

        _db.FamillesOrganes.Remove(entity);
        await _db.SaveChangesAsync();
        return SuccessResult();
    }

    public async Task<JsonResult> OnPostDeleteSousFamilleOrganeAsync([FromBody] DeleteRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Id))
        {
            return ErrorResult("Suppression invalide.");
        }

        var entity = await _db.SousFamillesOrganes.FirstOrDefaultAsync(sf => sf.Id == request.Id);
        if (entity is null)
        {
            return ErrorResult("Sous-famille introuvable.");
        }

        _db.SousFamillesOrganes.Remove(entity);
        await _db.SaveChangesAsync();
        return SuccessResult();
    }

    public async Task<JsonResult> OnPostDeleteGroupeArticleAsync([FromBody] DeleteRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Id))
        {
            return ErrorResult("Suppression invalide.");
        }

        var entity = await _db.GroupesArticles.FirstOrDefaultAsync(g => g.Id == request.Id);
        if (entity is null)
        {
            return ErrorResult("Groupe introuvable.");
        }

        _db.GroupesArticles.Remove(entity);
        await _db.SaveChangesAsync();
        return SuccessResult();
    }

    public async Task<JsonResult> OnPostDeleteFamilleArticleAsync([FromBody] DeleteRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Id))
        {
            return ErrorResult("Suppression invalide.");
        }

        var entity = await _db.FamillesArticles.FirstOrDefaultAsync(f => f.Id == request.Id);
        if (entity is null)
        {
            return ErrorResult("Famille introuvable.");
        }

        _db.FamillesArticles.Remove(entity);
        await _db.SaveChangesAsync();
        return SuccessResult();
    }

    public async Task<JsonResult> OnPostDeleteSousFamilleArticleAsync([FromBody] DeleteRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Id))
        {
            return ErrorResult("Suppression invalide.");
        }

        var entity = await _db.SousFamillesArticles.FirstOrDefaultAsync(sf => sf.Id == request.Id);
        if (entity is null)
        {
            return ErrorResult("Sous-famille introuvable.");
        }

        _db.SousFamillesArticles.Remove(entity);
        await _db.SaveChangesAsync();
        return SuccessResult();
    }

    public async Task<JsonResult> OnPostDeleteEquipementAsync([FromBody] DeleteRequest request)
    {
        var entrepriseId = ResolveEntrepriseId(null);
        if (string.IsNullOrWhiteSpace(entrepriseId) || string.IsNullOrWhiteSpace(request.Id))
        {
            return ErrorResult("Suppression invalide.");
        }

        var equipement = await _db.Equipements.FirstOrDefaultAsync(eq => eq.Id == request.Id
            && _db.Services.Any(service => service.Id == eq.ServiceId
                && _db.Departements.Any(dep => dep.Id == service.DepartementId
                    && _db.Divisions.Any(div => div.Id == dep.DivisionId
                        && _db.Unites.Any(unite => unite.Id == div.UniteId && unite.EntrepriseId == entrepriseId)))));
        if (equipement is null)
        {
            return ErrorResult("\u00c9quipement introuvable.");
        }

        _db.Equipements.Remove(equipement);
        await _db.SaveChangesAsync();
        return SuccessResult();
    }

    public async Task<JsonResult> OnPostDeleteArticleAsync([FromBody] DeleteRequest request)
    {
        var entrepriseId = ResolveEntrepriseId(null);
        if (string.IsNullOrWhiteSpace(entrepriseId) || string.IsNullOrWhiteSpace(request.Id))
        {
            return ErrorResult("Suppression invalide.");
        }

        var article = await _db.Articles.FirstOrDefaultAsync(a => a.Id == request.Id && a.EntrepriseId == entrepriseId);
        if (article is null)
        {
            return ErrorResult("Article introuvable.");
        }

        _db.Articles.Remove(article);
        await _db.SaveChangesAsync();
        return SuccessResult();
    }

    public async Task<JsonResult> OnPostDeleteOrganeAsync([FromBody] DeleteRequest request)
    {
        var entrepriseId = ResolveEntrepriseId(null);
        if (string.IsNullOrWhiteSpace(entrepriseId) || string.IsNullOrWhiteSpace(request.Id))
        {
            return ErrorResult("Suppression invalide.");
        }

        var organe = await _db.Organes.FirstOrDefaultAsync(org => org.Id == request.Id
            && _db.Equipements.Any(eq => eq.Id == org.EquipementId
                && _db.Services.Any(service => service.Id == eq.ServiceId
                    && _db.Departements.Any(dep => dep.Id == service.DepartementId
                        && _db.Divisions.Any(div => div.Id == dep.DivisionId
                            && _db.Unites.Any(unite => unite.Id == div.UniteId && unite.EntrepriseId == entrepriseId))))));
        if (organe is null)
        {
            return ErrorResult("Organe introuvable.");
        }

        _db.Organes.Remove(organe);
        await _db.SaveChangesAsync();
        return SuccessResult();
    }

    private async Task ApplyEquipementClassificationAsync(Equipement equipement)
    {
        if (string.IsNullOrWhiteSpace(equipement.GroupeId))
        {
            equipement.GroupeId = null;
            equipement.GroupeNom = null;
            equipement.FamilleId = null;
            equipement.FamilleNom = null;
            equipement.SousFamilleId = null;
            equipement.SousFamilleNom = null;
            return;
        }

        equipement.GroupeNom = await _db.GroupesEquipements.AsNoTracking()
            .Where(g => g.Id == equipement.GroupeId)
            .Select(g => g.Nom)
            .FirstOrDefaultAsync();

        if (string.IsNullOrWhiteSpace(equipement.FamilleId))
        {
            equipement.FamilleId = null;
            equipement.FamilleNom = null;
            equipement.SousFamilleId = null;
            equipement.SousFamilleNom = null;
            return;
        }

        var famille = await _db.FamillesEquipements.AsNoTracking()
            .Where(f => f.Id == equipement.FamilleId)
            .Select(f => new { f.Nom, f.GroupeId })
            .FirstOrDefaultAsync();

        if (famille is null || famille.GroupeId != equipement.GroupeId)
        {
            equipement.FamilleId = null;
            equipement.FamilleNom = null;
            equipement.SousFamilleId = null;
            equipement.SousFamilleNom = null;
            return;
        }

        equipement.FamilleNom = famille.Nom;

        if (string.IsNullOrWhiteSpace(equipement.SousFamilleId))
        {
            equipement.SousFamilleId = null;
            equipement.SousFamilleNom = null;
            return;
        }

        var sousFamille = await _db.SousFamillesEquipements.AsNoTracking()
            .Where(sf => sf.Id == equipement.SousFamilleId)
            .Select(sf => new { sf.Nom, sf.FamilleId, sf.GroupeId })
            .FirstOrDefaultAsync();

        if (sousFamille is null
            || sousFamille.FamilleId != equipement.FamilleId
            || (!string.IsNullOrWhiteSpace(sousFamille.GroupeId) && sousFamille.GroupeId != equipement.GroupeId))
        {
            equipement.SousFamilleId = null;
            equipement.SousFamilleNom = null;
            return;
        }

        equipement.SousFamilleNom = sousFamille.Nom;
    }

    private static string? NormalizeOptional(string? value)
        => string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static string NormalizeOrFallback(string? value, string prefix)
        => string.IsNullOrWhiteSpace(value) ? $"{prefix}{Guid.NewGuid().ToString("N")[..6].ToUpperInvariant()}" : value.Trim();

    private string? ResolveEntrepriseId(string? requested)
    {
        var claim = User.FindFirst("EntrepriseId")?.Value;
        return !string.IsNullOrWhiteSpace(claim) ? claim : requested;
    }

    private static JsonResult ErrorResult(string error)
        => new(new { success = false, error }) { StatusCode = 400 };

    private static JsonResult SuccessResult()
        => new(new { success = true }) { StatusCode = 200 };

    private static bool ValidateUnite(UniteRequest request, out string error)
    {
        if (string.IsNullOrWhiteSpace(request.Nom)
            || string.IsNullOrWhiteSpace(request.Wilaya)
            || string.IsNullOrWhiteSpace(request.Daira)
            || string.IsNullOrWhiteSpace(request.Commune)
            || string.IsNullOrWhiteSpace(request.Directeur)
            || string.IsNullOrWhiteSpace(request.Telephone)
            || string.IsNullOrWhiteSpace(request.Email))
        {
            error = "Veuillez remplir tous les champs obligatoires de l'unit�.";
            return false;
        }

        error = string.Empty;
        return true;
    }

    private static bool ValidateArticle(ArticleRequest request, out string error)
    {
        if (string.IsNullOrWhiteSpace(request.Designation)
            || string.IsNullOrWhiteSpace(request.UniteMesure))
        {
            error = "Veuillez remplir tous les champs obligatoires de l'article.";
            return false;
        }

        error = string.Empty;
        return true;
    }

    private static bool ValidateEquipement(EquipementRequest request, out string error)
    {
        if (string.IsNullOrWhiteSpace(request.Nom)
            || string.IsNullOrWhiteSpace(request.Marque)
            || string.IsNullOrWhiteSpace(request.ServiceId))
        {
            error = "Veuillez remplir tous les champs obligatoires de l'�quipement.";
            return false;
        }

        error = string.Empty;
        return true;
    }

    private static bool ValidateOrgane(OrganeRequest request, out string error)
    {
        if (string.IsNullOrWhiteSpace(request.Nom)
            || string.IsNullOrWhiteSpace(request.EquipementId))
        {
            error = "Veuillez remplir tous les champs obligatoires de l'organe.";
            return false;
        }

        error = string.Empty;
        return true;
    }

    private static bool ValidateDivision(DivisionRequest request, out string error)
    {
        if (string.IsNullOrWhiteSpace(request.UniteId)
            || string.IsNullOrWhiteSpace(request.Nom)
            || string.IsNullOrWhiteSpace(request.Responsable)
            || string.IsNullOrWhiteSpace(request.Telephone)
            || string.IsNullOrWhiteSpace(request.Email))
        {
            error = "Veuillez remplir tous les champs obligatoires de la division.";
            return false;
        }

        error = string.Empty;
        return true;
    }

    private static bool ValidateDepartement(DepartementRequest request, out string error)
    {
        if (string.IsNullOrWhiteSpace(request.DivisionId)
            || string.IsNullOrWhiteSpace(request.Nom)
            || string.IsNullOrWhiteSpace(request.Chef)
            || string.IsNullOrWhiteSpace(request.Telephone)
            || string.IsNullOrWhiteSpace(request.Email))
        {
            error = "Veuillez remplir tous les champs obligatoires du d�partement.";
            return false;
        }

        error = string.Empty;
        return true;
    }

    private static bool ValidateService(ServiceRequest request, out string error)
    {
        if (string.IsNullOrWhiteSpace(request.DepartementId)
            || string.IsNullOrWhiteSpace(request.Nom)
            || string.IsNullOrWhiteSpace(request.Chef)
            || string.IsNullOrWhiteSpace(request.Telephone)
            || string.IsNullOrWhiteSpace(request.Email))
        {
            error = "Veuillez remplir tous les champs obligatoires du service.";
            return false;
        }

        error = string.Empty;
        return true;
    }

    public sealed class UniteRequest
    {
        public string? Id { get; set; }
        public string? Code { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string Wilaya { get; set; } = string.Empty;
        public string Daira { get; set; } = string.Empty;
        public string Commune { get; set; } = string.Empty;
        public string? Adresse { get; set; }
        public string Directeur { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? EntrepriseId { get; set; }
    }

    public sealed class DivisionRequest
    {
        public string? Id { get; set; }
        public string? Code { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string Responsable { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string UniteId { get; set; } = string.Empty;
    }

    public sealed class DepartementRequest
    {
        public string? Id { get; set; }
        public string? Code { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string Chef { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string DivisionId { get; set; } = string.Empty;
    }

    public sealed class ServiceRequest
    {
        public string? Id { get; set; }
        public string? Code { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string Chef { get; set; } = string.Empty;
        public string Telephone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string DepartementId { get; set; } = string.Empty;
    }

    public sealed class EquipementRequest
    {
        public string? Id { get; set; }
        public string? Code { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string Marque { get; set; } = string.Empty;
        public string? Fournisseur { get; set; }
        public string? NumeroSerie { get; set; }
        public DateTime? DateAchat { get; set; }
        public decimal? PrixAchat { get; set; }
        public DateTime? DateMiseEnService { get; set; }
        public int? PeriodeGarantie { get; set; }
        public string? PeriodeGarantieUnite { get; set; }
        public string? Criticite { get; set; }
        public string? Statut { get; set; }
        public string? Notes { get; set; }
        public string? Photo { get; set; }
        public List<DocumentDto>? Documents { get; set; }
        public string? GroupeId { get; set; }
        public string? GroupeNom { get; set; }
        public string? FamilleId { get; set; }
        public string? FamilleNom { get; set; }
        public string? SousFamilleId { get; set; }
        public string? SousFamilleNom { get; set; }
        public string? ServiceId { get; set; }
        public string? EntrepriseId { get; set; }
    }

    public sealed class ArticleRequest
    {
        public string? Id { get; set; }
        public string? Code { get; set; }
        public string Designation { get; set; } = string.Empty;
        public string? ReferenceInterne { get; set; }
        public string? ReferenceFabricant { get; set; }
        public string? Marque { get; set; }
        public string? Fournisseur { get; set; }
        public string? Type { get; set; }
        public string? UniteMesure { get; set; }
        public decimal? StockActuel { get; set; }
        public string? EmplacementStock { get; set; }
        public decimal? StockMinimum { get; set; }
        public decimal? StockCritique { get; set; }
        public decimal? QteReapprovisionnement { get; set; }
        public decimal? PrixUnitaire { get; set; }
        public decimal? ValeurTotale { get; set; }
        public DateTime? DateInventaire { get; set; }
        public DateTime? DateDernierMouvement { get; set; }
        public string? Photo { get; set; }
        public List<DocumentDto>? Documents { get; set; }
        public string? Notes { get; set; }
        public string? GroupeId { get; set; }
        public string? GroupeNom { get; set; }
        public string? FamilleId { get; set; }
        public string? FamilleNom { get; set; }
        public string? SousFamilleId { get; set; }
        public string? SousFamilleNom { get; set; }
        public List<ArticleOrganeLinkDto>? OrganeLinks { get; set; }
        public string? EntrepriseId { get; set; }
    }

    public sealed class ArticleOrganeLinkDto
    {
        public string? OrganeId { get; set; }
        public string? OrganeNom { get; set; }
        public string? EquipementNom { get; set; }
        public decimal? QteUtilisee { get; set; }
    }

    public sealed class OrganeRequest
    {
        public string? Id { get; set; }
        public string? Code { get; set; }
        public string Nom { get; set; } = string.Empty;
        public string? GroupeId { get; set; }
        public string? GroupeNom { get; set; }
        public string? FamilleId { get; set; }
        public string? FamilleNom { get; set; }
        public string? SousFamilleId { get; set; }
        public string? SousFamilleNom { get; set; }
        public string? EquipementId { get; set; }
        public string? Marque { get; set; }
        public string? Reference { get; set; }
        public string? Fournisseur { get; set; }
        public DateTime? DateInstallation { get; set; }
        public DateTime? DateRemplacement { get; set; }
        public int? DureeVie { get; set; }
        public string? DureeVieUnite { get; set; }
        public decimal? PrixUnitaire { get; set; }
        public int? PeriodeGarantie { get; set; }
        public string? PeriodeGarantieUnite { get; set; }
        public string? Statut { get; set; }
        public string? PositionSurEquipement { get; set; }
        public string? DescriptionTechnique { get; set; }
        public string? Photo { get; set; }
        public List<DocumentDto>? Documents { get; set; }
        public string? Notes { get; set; }
        public string? EntrepriseId { get; set; }
    }

    public sealed class DocumentDto
    {
        public string? Nom { get; set; }
        public string? Type { get; set; }
    }

    public sealed class DeleteRequest
    {
        public string? Id { get; set; }
    }

    // Quick-create request DTOs for groups/families/subfamilies
    public sealed class GroupeEquipementRequest { public string? Id { get; set; } public string? Code { get; set; } public string Nom { get; set; } = string.Empty; public string? Description { get; set; } }
    public sealed class FamilleEquipementRequest { public string? Id { get; set; } public string? Code { get; set; } public string Nom { get; set; } = string.Empty; public string? Description { get; set; } public string? GroupeId { get; set; } }
    public sealed class SousFamilleEquipementRequest { public string? Id { get; set; } public string? Code { get; set; } public string Nom { get; set; } = string.Empty; public string? Description { get; set; } public string? FamilleId { get; set; } public string? GroupeId { get; set; } }

    public sealed class GroupeOrganeRequest { public string? Id { get; set; } public string? Code { get; set; } public string Nom { get; set; } = string.Empty; public string? Description { get; set; } }
    public sealed class FamilleOrganeRequest { public string? Id { get; set; } public string? Code { get; set; } public string Nom { get; set; } = string.Empty; public string? Description { get; set; } public string? GroupeId { get; set; } }
    public sealed class SousFamilleOrganeRequest { public string? Id { get; set; } public string? Code { get; set; } public string Nom { get; set; } = string.Empty; public string? Description { get; set; } public string? FamilleId { get; set; } public string? GroupeId { get; set; } }

    public sealed class GroupeArticleRequest { public string? Id { get; set; } public string? Code { get; set; } public string Nom { get; set; } = string.Empty; public string? Description { get; set; } }
    public sealed class FamilleArticleRequest { public string? Id { get; set; } public string? Code { get; set; } public string Nom { get; set; } = string.Empty; public string? Description { get; set; } public string? GroupeId { get; set; } }
    public sealed class SousFamilleArticleRequest { public string? Id { get; set; } public string? Code { get; set; } public string Nom { get; set; } = string.Empty; public string? Description { get; set; } public string? FamilleId { get; set; } public string? GroupeId { get; set; } }
}
