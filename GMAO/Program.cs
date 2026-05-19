using System.Text.Json;
using System.Text.Json.Serialization;
using GMAO.Data;
using GMAO.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services
    .AddRazorPages()
    .AddJsonOptions(opts =>
    {
        opts.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        opts.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
        opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        opts.JsonSerializerOptions.NumberHandling = JsonNumberHandling.AllowReadingFromString;
    });
builder.Services
    .AddAuthentication(Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Auth/Login";
        options.AccessDeniedPath = "/Auth/Login";
        options.Cookie.Name = "GMAO.Auth";
    });
var connectionString = builder.Configuration.GetConnectionString("GmaoDatabase")
    ?? builder.Configuration.GetConnectionString("DefaultConnection")
    ?? "Server=(localdb)\\MSSQLLocalDB;Database=GMAO;Trusted_Connection=True;MultipleActiveResultSets=true";
builder.Services.AddDbContext<GmaoDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddScoped<IPasswordHasher<UserAccount>, PasswordHasher<UserAccount>>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/api/tree/{entrepriseId}", async (string entrepriseId, GmaoDbContext db) =>
{
    var entreprise = await db.Entreprises.AsNoTracking().FirstOrDefaultAsync(e => e.Id == entrepriseId);
    var unites = await db.Unites.AsNoTracking().Where(u => u.EntrepriseId == entrepriseId).ToListAsync();
    var uniteIds = unites.Select(u => u.Id).ToList();
    var divisions = await db.Divisions.AsNoTracking().Where(d => uniteIds.Contains(d.UniteId)).ToListAsync();
    var divisionIds = divisions.Select(d => d.Id).ToList();
    var departements = await db.Departements.AsNoTracking().Where(d => divisionIds.Contains(d.DivisionId)).ToListAsync();
    var departementIds = departements.Select(d => d.Id).ToList();
    var services = await db.Services.AsNoTracking().Where(s => departementIds.Contains(s.DepartementId)).ToListAsync();
    var serviceIds = services.Select(s => s.Id).ToList();
    var equipements = await db.Equipements.AsNoTracking()
        .Where(e => e.ServiceId != null && serviceIds.Contains(e.ServiceId))
        .ToListAsync();
    var equipementIds = equipements.Select(e => e.Id).ToList();
    var sousEnsembles = await db.Articles.AsNoTracking()
        .Where(article => article.EquipementId != null
            && equipementIds.Contains(article.EquipementId)
            && (article.OrganeLinksJson == null || article.OrganeLinksJson == ""))
        .ToListAsync();
    var sousEnsembleIds = sousEnsembles.Select(se => se.Id).ToList();
    var organes = await db.Organes.AsNoTracking().Where(o => equipementIds.Contains(o.EquipementId)).ToListAsync();

    var refGroupesEquipements = await db.GroupesEquipements.AsNoTracking().OrderBy(g => g.Nom).ToListAsync();
    var refFamillesEquipements = await db.FamillesEquipements.AsNoTracking().OrderBy(f => f.Nom).ToListAsync();
    var refSousFamillesEquipements = await db.SousFamillesEquipements.AsNoTracking().OrderBy(sf => sf.Nom).ToListAsync();
    var refGroupesOrganes = await db.GroupesOrganes.AsNoTracking().OrderBy(g => g.Nom).ToListAsync();
    var refFamillesOrganes = await db.FamillesOrganes.AsNoTracking().OrderBy(f => f.Nom).ToListAsync();
    var refSousFamillesOrganes = await db.SousFamillesOrganes.AsNoTracking().OrderBy(sf => sf.Nom).ToListAsync();
    var refGroupesArticles = await db.GroupesArticles.AsNoTracking().OrderBy(g => g.Nom).ToListAsync();
    var refFamillesArticles = await db.FamillesArticles.AsNoTracking().OrderBy(f => f.Nom).ToListAsync();
    var refSousFamillesArticles = await db.SousFamillesArticles.AsNoTracking().OrderBy(sf => sf.Nom).ToListAsync();

    var organesByEquipement = organes
        .GroupBy(o => o.EquipementId)
        .ToDictionary(g => g.Key, g => g.ToList());
    var articlesByOrgane = await db.Articles.AsNoTracking()
        .Where(article => article.OrganeLinksJson != null)
        .Select(article => new
        {
            article.Id,
            article.Code,
            article.Nom,
            article.Designation,
            article.OrganeLinksJson,
            article.GroupeId,
            article.GroupeNom,
            article.FamilleId,
            article.FamilleNom,
            article.SousFamilleId,
            article.SousFamilleNom
        })
        .ToListAsync();
    var sousEnsemblesByEquipement = sousEnsembles
        .GroupBy(se => se.EquipementId)
        .ToDictionary(g => g.Key, g => g.ToList());
    var equipementsByService = equipements
        .GroupBy(e => e.ServiceId)
        .ToDictionary(g => g.Key, g => g.ToList());
    var servicesByDepartement = services
        .GroupBy(s => s.DepartementId)
        .ToDictionary(g => g.Key, g => g.ToList());
    var departementsByDivision = departements
        .GroupBy(d => d.DivisionId)
        .ToDictionary(g => g.Key, g => g.ToList());
    var divisionsByUnite = divisions
        .GroupBy(d => d.UniteId)
        .ToDictionary(g => g.Key, g => g.ToList());

    static string NormalizeNodeKey(string? value, string fallback)
        => string.IsNullOrWhiteSpace(value)
            ? fallback
            : value.Trim().Replace(" ", "-").Replace("/", "-");

    static bool RefMatches(string? entityId, string? entityNom, string refId, string refNom)
    {
        if (!string.IsNullOrWhiteSpace(entityId) && entityId == refId)
        {
            return true;
        }

        return string.IsNullOrWhiteSpace(entityId)
            && !string.IsNullOrWhiteSpace(entityNom)
            && !string.IsNullOrWhiteSpace(refNom)
            && string.Equals(entityNom.Trim(), refNom.Trim(), StringComparison.OrdinalIgnoreCase);
    }

    object BuildEquipementNode(Equipement equipement)
        => new
        {
            id = $"equipement-{equipement.Id}",
            type = "equipement",
            nom = equipement.Nom,
            tag = equipement.Tag,
            statut = equipement.Statut,
            criticite = equipement.Criticite,
            icon = "cog",
            children = (
                (sousEnsemblesByEquipement.TryGetValue(equipement.Id, out var equipementSousEnsembles)
                ? equipementSousEnsembles.Select(sousEnsemble => (object)new
                {
                    id = $"sousensemble-{sousEnsemble.Id}",
                    type = "sousensemble",
                    nom = !string.IsNullOrWhiteSpace(sousEnsemble.Nom) ? sousEnsemble.Nom : sousEnsemble.Designation,
                    code = sousEnsemble.Code,
                    icon = "layers",
                    children = Array.Empty<object>()
                })
                : Enumerable.Empty<object>())
            ).Concat(BuildOrganeHierarchy(equipement.Id))
            .ToList()
        };

    static bool HasFamille(Equipement equipement)
        => !string.IsNullOrWhiteSpace(equipement.FamilleId) || !string.IsNullOrWhiteSpace(equipement.FamilleNom);

    static bool HasSousFamille(Equipement equipement)
        => !string.IsNullOrWhiteSpace(equipement.SousFamilleId) || !string.IsNullOrWhiteSpace(equipement.SousFamilleNom);

    List<object> BuildEquipementHierarchy(string serviceId, List<Equipement> serviceEquipements)
    {
        var assigned = new HashSet<string>();
        var nodes = new List<object>();

        foreach (var groupe in refGroupesEquipements)
        {
            var familleNodes = new List<object>();

            foreach (var famille in refFamillesEquipements.Where(f => f.GroupeId == groupe.Id))
            {
                var sousNodes = new List<object>();

                foreach (var sous in refSousFamillesEquipements.Where(sf => sf.FamilleId == famille.Id))
                {
                    var equipementChildren = serviceEquipements
                        .Where(eq => !assigned.Contains(eq.Id)
                            && RefMatches(eq.GroupeId, eq.GroupeNom, groupe.Id, groupe.Nom)
                            && RefMatches(eq.FamilleId, eq.FamilleNom, famille.Id, famille.Nom)
                            && RefMatches(eq.SousFamilleId, eq.SousFamilleNom, sous.Id, sous.Nom))
                        .ToList();

                    foreach (var eq in equipementChildren)
                    {
                        assigned.Add(eq.Id);
                    }

                    if (equipementChildren.Count > 0)
                    {
                        sousNodes.Add(new
                        {
                            id = $"sousfamilleequip-{serviceId}-{groupe.Id}-{famille.Id}-{sous.Id}",
                            type = "sousFamilleEquip",
                            nom = sous.Nom,
                            code = sous.Id,
                            children = equipementChildren.Select(BuildEquipementNode).Cast<object>().ToList()
                        });
                    }
                }

                var equipementsFamilleOnly = serviceEquipements
                    .Where(eq => !assigned.Contains(eq.Id)
                        && RefMatches(eq.GroupeId, eq.GroupeNom, groupe.Id, groupe.Nom)
                        && RefMatches(eq.FamilleId, eq.FamilleNom, famille.Id, famille.Nom)
                        && !HasSousFamille(eq))
                    .ToList();

                foreach (var eq in equipementsFamilleOnly)
                {
                    assigned.Add(eq.Id);
                }

                if (equipementsFamilleOnly.Count > 0)
                {
                    sousNodes.Add(new
                    {
                        id = $"sousfamilleequip-{serviceId}-{groupe.Id}-{famille.Id}-sans-sous",
                        type = "sousFamilleEquip",
                        nom = "Sans sous-famille",
                        code = (string?)null,
                        children = equipementsFamilleOnly.Select(BuildEquipementNode).Cast<object>().ToList()
                    });
                }

                if (sousNodes.Count > 0)
                {
                    familleNodes.Add(new
                    {
                        id = $"familleequip-{serviceId}-{groupe.Id}-{famille.Id}",
                        type = "familleEquip",
                        nom = famille.Nom,
                        code = famille.Id,
                        children = sousNodes
                    });
                }
            }

            var equipementsGroupeOnly = serviceEquipements
                .Where(eq => !assigned.Contains(eq.Id)
                    && RefMatches(eq.GroupeId, eq.GroupeNom, groupe.Id, groupe.Nom)
                    && !HasFamille(eq))
                .ToList();

            foreach (var eq in equipementsGroupeOnly)
            {
                assigned.Add(eq.Id);
            }

            if (equipementsGroupeOnly.Count > 0)
            {
                familleNodes.Add(new
                {
                    id = $"familleequip-{serviceId}-{groupe.Id}-sans-famille",
                    type = "familleEquip",
                    nom = "Sans famille",
                    code = (string?)null,
                    children = new List<object>
                    {
                        new
                        {
                            id = $"sousfamilleequip-{serviceId}-{groupe.Id}-sans-sous",
                            type = "sousFamilleEquip",
                            nom = "—",
                            code = (string?)null,
                            children = equipementsGroupeOnly.Select(BuildEquipementNode).Cast<object>().ToList()
                        }
                    }
                });
            }

            nodes.Add(new
            {
                id = $"groupeequip-{serviceId}-{groupe.Id}",
                type = "groupeEquip",
                nom = groupe.Nom,
                code = groupe.Id,
                children = familleNodes
            });
        }

        var unassigned = serviceEquipements.Where(eq => !assigned.Contains(eq.Id)).ToList();
        if (unassigned.Count > 0)
        {
            nodes.Add(new
            {
                id = $"groupeequip-{serviceId}-non-classe",
                type = "groupeEquip",
                nom = "Groupe non defini",
                code = (string?)null,
                children = new List<object>
                {
                    new
                    {
                        id = $"familleequip-{serviceId}-non-classe-sans-famille",
                        type = "familleEquip",
                        nom = "Sans famille",
                        code = (string?)null,
                        children = new List<object>
                        {
                            new
                            {
                                id = $"sousfamilleequip-{serviceId}-non-classe-sans-sous",
                                type = "sousFamilleEquip",
                                nom = "—",
                                code = (string?)null,
                                children = unassigned.Select(BuildEquipementNode).Cast<object>().ToList()
                            }
                        }
                    }
                }
            });
        }

        return nodes;
    }

    List<object> BuildOrganeHierarchy(string equipementId)
    {
        if (!organesByEquipement.TryGetValue(equipementId, out var equipementOrganes) || equipementOrganes == null)
        {
            return new List<object>();
        }

        var assigned = new HashSet<string>();
        var nodes = new List<object>();

        foreach (var groupe in refGroupesOrganes)
        {
            var familleNodes = new List<object>();
            foreach (var famille in refFamillesOrganes.Where(f => f.GroupeId == groupe.Id))
            {
                var sousNodes = new List<object>();
                foreach (var sous in refSousFamillesOrganes.Where(sf => sf.FamilleId == famille.Id))
                {
                    var organeChildren = equipementOrganes
                        .Where(org => !assigned.Contains(org.Id)
                            && RefMatches(org.GroupeId, org.GroupeNom, groupe.Id, groupe.Nom)
                            && RefMatches(org.FamilleId, org.FamilleNom, famille.Id, famille.Nom)
                            && RefMatches(org.SousFamilleId, org.SousFamilleNom, sous.Id, sous.Nom))
                        .Select(org =>
                        {
                            assigned.Add(org.Id);
                            return (object)new
                            {
                                id = $"organe-{org.Id}",
                                type = "organe",
                                nom = org.Nom,
                                code = org.Code,
                                icon = "puzzle",
                                children = BuildArticleHierarchyForOrgane(org.Id)
                            };
                        })
                        .ToList();

                    sousNodes.Add(new
                    {
                        id = $"sousfamilleorg-{equipementId}-{groupe.Id}-{famille.Id}-{sous.Id}",
                        type = "sousFamilleOrgane",
                        nom = sous.Nom,
                        code = sous.Id,
                        children = organeChildren
                    });
                }

                familleNodes.Add(new
                {
                    id = $"familleorg-{equipementId}-{groupe.Id}-{famille.Id}",
                    type = "familleOrgane",
                    nom = famille.Nom,
                    code = famille.Id,
                    children = sousNodes
                });
            }

            nodes.Add(new
            {
                id = $"groupeorg-{equipementId}-{groupe.Id}",
                type = "groupeOrgane",
                nom = groupe.Nom,
                code = groupe.Id,
                children = familleNodes
            });
        }

        var unassigned = equipementOrganes.Where(org => !assigned.Contains(org.Id)).ToList();
        if (unassigned.Count > 0)
        {
            nodes.Add(new
            {
                id = $"groupeorg-{equipementId}-non-classe",
                type = "groupeOrgane",
                nom = "Groupe non defini",
                code = (string?)null,
                children = unassigned.Select(org => (object)new
                {
                    id = $"organe-{org.Id}",
                    type = "organe",
                    nom = org.Nom,
                    code = org.Code,
                    icon = "puzzle",
                    children = BuildArticleHierarchyForOrgane(org.Id)
                }).ToList()
            });
        }

        return nodes;
    }

    List<object> BuildArticleHierarchyForOrgane(string organeId)
    {
        var related = articlesByOrgane
            .Where(article => !string.IsNullOrWhiteSpace(article.OrganeLinksJson)
                && JsonSerializer.Deserialize<List<ArticleOrganeLink>>(article.OrganeLinksJson!)
                    ?.Any(link => link.OrganeId == organeId) == true)
            .ToList();

        if (related.Count == 0)
        {
            return new List<object>();
        }

        var assigned = new HashSet<string>();
        var nodes = new List<object>();

        foreach (var groupe in refGroupesArticles)
        {
            var familleNodes = new List<object>();
            foreach (var famille in refFamillesArticles.Where(f => f.GroupeId == groupe.Id))
            {
                var sousNodes = new List<object>();
                foreach (var sous in refSousFamillesArticles.Where(sf => sf.FamilleId == famille.Id))
                {
                    var articleChildren = related
                        .Where(article => !assigned.Contains(article.Id)
                            && RefMatches(article.GroupeId, article.GroupeNom, groupe.Id, groupe.Nom)
                            && RefMatches(article.FamilleId, article.FamilleNom, famille.Id, famille.Nom)
                            && RefMatches(article.SousFamilleId, article.SousFamilleNom, sous.Id, sous.Nom))
                        .Select(article =>
                        {
                            assigned.Add(article.Id);
                            return (object)new
                            {
                                id = $"article-{article.Id}",
                                type = "article",
                                nom = string.IsNullOrWhiteSpace(article.Nom) ? article.Designation : article.Nom,
                                code = article.Code,
                                icon = "box"
                            };
                        })
                        .ToList();

                    sousNodes.Add(new
                    {
                        id = $"sousfamillearticle-{organeId}-{groupe.Id}-{famille.Id}-{sous.Id}",
                        type = "sousFamilleArticle",
                        nom = sous.Nom,
                        code = sous.Id,
                        children = articleChildren
                    });
                }

                familleNodes.Add(new
                {
                    id = $"famillearticle-{organeId}-{groupe.Id}-{famille.Id}",
                    type = "familleArticle",
                    nom = famille.Nom,
                    code = famille.Id,
                    children = sousNodes
                });
            }

            nodes.Add(new
            {
                id = $"groupearticle-{organeId}-{groupe.Id}",
                type = "groupeArticle",
                nom = groupe.Nom,
                code = groupe.Id,
                children = familleNodes
            });
        }

        var unassignedArticles = related.Where(article => !assigned.Contains(article.Id)).ToList();
        if (unassignedArticles.Count > 0)
        {
            nodes.Add(new
            {
                id = $"groupearticle-{organeId}-non-classe",
                type = "groupeArticle",
                nom = "Groupe non defini",
                code = (string?)null,
                children = unassignedArticles.Select(article => (object)new
                {
                    id = $"article-{article.Id}",
                    type = "article",
                    nom = string.IsNullOrWhiteSpace(article.Nom) ? article.Designation : article.Nom,
                    code = article.Code,
                    icon = "box"
                }).ToList()
            });
        }

        return nodes;
    }


    var uniteNodes = unites.Select(unite => new
    {
        id = $"unite-{unite.Id}",
        type = "unite",
        nom = unite.Nom,
        code = unite.Code,
        icon = "building",
        children = divisionsByUnite.TryGetValue(unite.Id, out var uniteDivisions)
            ? uniteDivisions.Select(division => (object)new
            {
                id = $"division-{division.Id}",
                type = "division",
                nom = division.Nom,
                code = division.Code,
                icon = "sitemap",
                children = departementsByDivision.TryGetValue(division.Id, out var divisionDepartements)
                    ? divisionDepartements.Select(departement => (object)new
                    {
                        id = $"departement-{departement.Id}",
                        type = "departement",
                        nom = departement.Nom,
                        code = departement.Code,
                        icon = "grid",
                        children = servicesByDepartement.TryGetValue(departement.Id, out var departementServices)
                            ? departementServices.Select(service => (object)new
                            {
                                id = $"service-{service.Id}",
                                type = "service",
                                nom = service.Nom,
                                code = service.Code,
                                icon = "tools",
                                children = equipementsByService.TryGetValue(service.Id, out var serviceEquipements)
                                    ? BuildEquipementHierarchy(service.Id, serviceEquipements)
                                    : new List<object>()
                            }).ToList()
                            : new List<object>()
                    }).ToList()
                    : new List<object>()
            }).ToList()
            : new List<object>()
    }).ToList();

    var result = new List<object>
    {
        new
        {
            id = $"entreprise-{entrepriseId}",
            type = "entreprise",
            nom = entreprise?.Nom ?? "Entreprise",
            code = entreprise?.Code ?? entrepriseId,
            icon = "building",
            children = uniteNodes
        }
    };

    return Results.Json(result);
});

app.MapRazorPages();

app.Run();

internal sealed class ArticleOrganeLink
{
    public string? OrganeId { get; set; }
}
