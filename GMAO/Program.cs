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
    var articlesByEntreprise = await db.Articles.AsNoTracking()
        .Where(article => article.EntrepriseId == entrepriseId)
        .Select(article => new
        {
            article.Id,
            article.Code,
            article.Nom,
            article.Designation,
            article.ReferenceInterne,
            article.OrganeLinksJson,
            article.GroupeId,
            article.GroupeNom,
            article.FamilleId,
            article.FamilleNom,
            article.SousFamilleId,
            article.SousFamilleNom,
            article.StockActuel,
            article.StockMinimum,
            article.EquipementId
        })
        .ToListAsync();
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

        // IMPORTANT :
        // uniquement les organes sous l'équipement
        children = BuildOrganeHierarchy(equipement.Id)
    };

    static bool HasFamille(Equipement equipement)
        => !string.IsNullOrWhiteSpace(equipement.FamilleId) || !string.IsNullOrWhiteSpace(equipement.FamilleNom);

    static bool HasSousFamille(Equipement equipement)
        => !string.IsNullOrWhiteSpace(equipement.SousFamilleId) || !string.IsNullOrWhiteSpace(equipement.SousFamilleNom);

    List<object> BuildEquipementHierarchy(string serviceId, List<Equipement> serviceEquipements)
    {
        var assigned = new HashSet<string>();
        var nodes = new List<object>();

        static string BuildKey(string? id, string? nom)
            => !string.IsNullOrWhiteSpace(id)
                ? $"id:{id.Trim()}"
                : !string.IsNullOrWhiteSpace(nom)
                    ? $"nom:{nom.Trim().ToLowerInvariant()}"
                    : string.Empty;

        static string BuildLabel(string? nom, string? id)
            => !string.IsNullOrWhiteSpace(nom)
                ? nom.Trim()
                : !string.IsNullOrWhiteSpace(id)
                    ? id.Trim()
                    : string.Empty;

        object BuildSousFamilleNode(string? sousFamilleId, string? sousFamilleNom, IEnumerable<Equipement> items, string groupNodeKey, string familyNodeKey)
        {
            var itemList = items
                .Where(eq => !assigned.Contains(eq.Id))
                .ToList();

            foreach (var eq in itemList)
            {
                assigned.Add(eq.Id);
            }

            return new
            {
                id = $"sousfamilleequip-{serviceId}-{groupNodeKey}-{familyNodeKey}-{NormalizeNodeKey(sousFamilleNom, sousFamilleId ?? "sans-sous")}",
                type = "sousFamilleEquip",
                nom = BuildLabel(sousFamilleNom, sousFamilleId),
                code = sousFamilleId,
                children = itemList.Select(BuildEquipementNode).Cast<object>().ToList()
            };
        }

        object BuildFamilleNode(string? familleId, string? familleNom, IEnumerable<Equipement> items, string groupNodeKey)
        {
            var familyItems = items
                .Where(eq => !assigned.Contains(eq.Id))
                .ToList();

            var sousNodes = new List<object>();
            var groupedSousFamilles = familyItems
                .GroupBy(eq => BuildKey(eq.SousFamilleId, eq.SousFamilleNom))
                .Where(group => !string.IsNullOrWhiteSpace(group.Key))
                .OrderBy(group => group.Select(eq => BuildLabel(eq.SousFamilleNom, eq.SousFamilleId)).FirstOrDefault())
                .ToList();

            foreach (var sousGroup in groupedSousFamilles)
            {
                var first = sousGroup.First();
                sousNodes.Add(BuildSousFamilleNode(first.SousFamilleId, first.SousFamilleNom, sousGroup, groupNodeKey, NormalizeNodeKey(familleNom, familleId ?? "sans-famille")));
            }

            var directItems = familyItems
                .Where(eq => string.IsNullOrWhiteSpace(BuildKey(eq.SousFamilleId, eq.SousFamilleNom)))
                .ToList();
            if (directItems.Count > 0)
            {
                sousNodes.Add(BuildSousFamilleNode(null, "Sans sous-famille", directItems, groupNodeKey, NormalizeNodeKey(familleNom, familleId ?? "sans-famille")));
            }

            if (sousNodes.Count == 0)
            {
                return null!;
            }

            return new
            {
                id = $"familleequip-{serviceId}-{groupNodeKey}-{NormalizeNodeKey(familleNom, familleId ?? "sans-famille")}",
                type = "familleEquip",
                nom = BuildLabel(familleNom, familleId),
                code = familleId,
                children = sousNodes
            };
        }

        var groupedByGroup = serviceEquipements
            .GroupBy(eq => BuildKey(eq.GroupeId, eq.GroupeNom))
            .Where(group => !string.IsNullOrWhiteSpace(group.Key))
            .OrderBy(group => group.Select(eq => BuildLabel(eq.GroupeNom, eq.GroupeId)).FirstOrDefault())
            .ToList();

        foreach (var group in groupedByGroup)
        {
            var first = group.First();
            var groupNodeKey = NormalizeNodeKey(first.GroupeNom, first.GroupeId ?? "groupe");
            var familyNodes = new List<object>();

            var groupedByFamily = group
                .GroupBy(eq => BuildKey(eq.FamilleId, eq.FamilleNom))
                .ToList();

            foreach (var familyGroup in groupedByFamily)
            {
                var firstFamily = familyGroup.First();
                var familyNode = BuildFamilleNode(firstFamily.FamilleId, firstFamily.FamilleNom, familyGroup, groupNodeKey);
                if (familyNode is not null)
                {
                    familyNodes.Add(familyNode);
                }
            }

            var directGroupItems = group
                .Where(eq => string.IsNullOrWhiteSpace(BuildKey(eq.FamilleId, eq.FamilleNom)))
                .ToList();
            if (directGroupItems.Count > 0)
            {
                familyNodes.Add(BuildFamilleNode(null, "Sans famille", directGroupItems, groupNodeKey));
            }

            if (familyNodes.Count > 0)
            {
                nodes.Add(new
                {
                    id = $"groupeequip-{serviceId}-{groupNodeKey}",
                    type = "groupeEquip",
                    nom = BuildLabel(first.GroupeNom, first.GroupeId),
                    code = first.GroupeId,
                    children = familyNodes
                });
            }
        }

        var unassigned = serviceEquipements
            .Where(eq => string.IsNullOrWhiteSpace(BuildKey(eq.GroupeId, eq.GroupeNom)))
            .ToList();
        if (unassigned.Count > 0)
        {
            var groupNodeKey = "non-classe";
            var familyNode = BuildFamilleNode(null, "Sans famille", unassigned, groupNodeKey);
            nodes.Add(new
            {
                id = $"groupeequip-{serviceId}-non-classe",
                type = "groupeEquip",
                nom = "Groupe non defini",
                code = (string?)null,
                children = familyNode is null ? new List<object>() : new List<object> { familyNode }
            });
        }

        return nodes;
    }


    List<object> BuildOrganeHierarchy(string equipementId)
    {
        var equipementOrganes = organesByEquipement.TryGetValue(equipementId, out var linkedOrganes) && linkedOrganes != null
            ? linkedOrganes
            : new List<Organe>();

        var assigned = new HashSet<string>();
        var nodes = new List<object>();

        static string BuildKey(string? id, string? nom)
            => !string.IsNullOrWhiteSpace(id)
                ? $"id:{id.Trim()}"
                : !string.IsNullOrWhiteSpace(nom)
                    ? $"nom:{nom.Trim().ToLowerInvariant()}"
                    : string.Empty;

        static string BuildLabel(string? nom, string? id)
            => !string.IsNullOrWhiteSpace(nom)
                ? nom.Trim()
                : !string.IsNullOrWhiteSpace(id)
                    ? id.Trim()
                    : string.Empty;

        object BuildOrganeNode(Organe org, bool hasArticlesChildren)
        {
            var children = new List<object>();

            // Ajouter TOUS les articles lies a cet organe directement sous l'organe
            // Cette approche est identique a BuildEquipementNode avec les articles
            var articleHierarchy = BuildArticleHierarchyForOrgane(org.Id);
            foreach (var node in articleHierarchy)
            {
                children.Add(node);
            }

            return new
            {
                id = $"organe-{org.Id}",
                type = "organe",
                nom = org.Nom,
                code = org.Code,
                icon = "puzzle",
                children = children
            };
        }

        object BuildSousFamilleNode(string? sousFamilleId, string? sousFamilleNom, IEnumerable<Organe> items, string groupNodeKey, string familyNodeKey)
        {
            var itemList = items
                .Where(org => !assigned.Contains(org.Id))
                .ToList();

            if (itemList.Count == 0) return null!;

            foreach (var org in itemList)
            {
                assigned.Add(org.Id);
            }

            return new
            {
                id = $"sousfamilleorg-{equipementId}-{groupNodeKey}-{familyNodeKey}-{NormalizeNodeKey(sousFamilleNom, sousFamilleId ?? "sans-sous")}",
                type = "sousFamilleOrgane",
                nom = BuildLabel(sousFamilleNom, sousFamilleId),
                code = sousFamilleId,
                children = itemList.Select(org => (object)BuildOrganeNode(org, true)).ToList()
            };
        }

        object BuildFamilleNode(string? familleId, string? familleNom, IEnumerable<Organe> items, string groupNodeKey)
        {
            var familyItems = items
                .Where(org => !assigned.Contains(org.Id))
                .ToList();

            if (familyItems.Count == 0) return null!;

            var sousNodes = new List<object>();
            var groupedSousFamilles = familyItems
                .GroupBy(org => BuildKey(org.SousFamilleId, org.SousFamilleNom))
                .Where(group => !string.IsNullOrWhiteSpace(group.Key))
                .OrderBy(group => group.Select(org => BuildLabel(org.SousFamilleNom, org.SousFamilleId)).FirstOrDefault())
                .ToList();

            foreach (var sousGroup in groupedSousFamilles)
            {
                var first = sousGroup.First();
                var sousNode = BuildSousFamilleNode(first.SousFamilleId, first.SousFamilleNom, sousGroup, groupNodeKey, NormalizeNodeKey(familleNom, familleId ?? "sans-famille"));
                if (sousNode is not null)
                {
                    sousNodes.Add(sousNode);
                }
            }

            var directItems = familyItems
                .Where(org => string.IsNullOrWhiteSpace(BuildKey(org.SousFamilleId, org.SousFamilleNom)))
                .ToList();
            if (directItems.Count > 0)
            {
                var directSousNode = BuildSousFamilleNode(null, "Sans sous-famille", directItems, groupNodeKey, NormalizeNodeKey(familleNom, familleId ?? "sans-famille"));
                if (directSousNode is not null)
                {
                    sousNodes.Add(directSousNode);
                }
            }

            if (sousNodes.Count == 0)
            {
                // Si pas de sous-familles, mettre les organes directement dans la famille
                return new
                {
                    id = $"familleorg-{equipementId}-{groupNodeKey}-{NormalizeNodeKey(familleNom, familleId ?? "sans-famille")}",
                    type = "familleOrgane",
                    nom = BuildLabel(familleNom, familleId),
                    code = familleId,
                    children = familyItems.Select(org => (object)BuildOrganeNode(org, true)).ToList()
                };
            }

            return new
            {
                id = $"familleorg-{equipementId}-{groupNodeKey}-{NormalizeNodeKey(familleNom, familleId ?? "sans-famille")}",
                type = "familleOrgane",
                nom = BuildLabel(familleNom, familleId),
                code = familleId,
                children = sousNodes
            };
        }

        var groupedByGroup = equipementOrganes
            .GroupBy(org => BuildKey(org.GroupeId, org.GroupeNom))
            .Where(group => !string.IsNullOrWhiteSpace(group.Key))
            .OrderBy(group => group.Select(org => BuildLabel(org.GroupeNom, org.GroupeId)).FirstOrDefault())
            .ToList();

        foreach (var group in groupedByGroup)
        {
            var first = group.First();
            var groupNodeKey = NormalizeNodeKey(first.GroupeNom, first.GroupeId ?? "groupe");
            var familyNodes = new List<object>();

            var groupedByFamily = group
                .GroupBy(org => BuildKey(org.FamilleId, org.FamilleNom))
                .ToList();

            foreach (var familyGroup in groupedByFamily)
            {
                var firstFamily = familyGroup.First();
                var familyNode = BuildFamilleNode(firstFamily.FamilleId, firstFamily.FamilleNom, familyGroup, groupNodeKey);
                if (familyNode is not null)
                {
                    familyNodes.Add(familyNode);
                }
            }

            var directGroupItems = group
                .Where(org => string.IsNullOrWhiteSpace(BuildKey(org.FamilleId, org.FamilleNom)))
                .ToList();
            if (directGroupItems.Count > 0)
            {
                familyNodes.Add(BuildFamilleNode(null, "Sans famille", directGroupItems, groupNodeKey));
            }

            if (familyNodes.Count > 0)
            {
                nodes.Add(new
                {
                    id = $"groupeorg-{equipementId}-{groupNodeKey}",
                    type = "groupeOrgane",
                    nom = BuildLabel(first.GroupeNom, first.GroupeId),
                    code = first.GroupeId,
                    children = familyNodes
                });
            }
        }

        var unassigned = equipementOrganes
            .Where(org => string.IsNullOrWhiteSpace(BuildKey(org.GroupeId, org.GroupeNom)))
            .ToList();
        if (unassigned.Count > 0)
        {
            var groupNodeKey = "non-classe";
            var familyNode = BuildFamilleNode(null, "Sans famille", unassigned, groupNodeKey);
            nodes.Add(new
            {
                id = $"groupeorg-{equipementId}-non-classe",
                type = "groupeOrgane",
                nom = "Groupe non defini",
                code = (string?)null,
                children = familyNode is null ? new List<object>() : new List<object> { familyNode }
            });
        }

        return nodes;
    }

    List<object> BuildArticleHierarchyForOrgane(string organeId)
    {
        var assigned = new HashSet<string>();
        var nodes = new List<object>();

        static string BuildKey(string? id, string? nom)
            => !string.IsNullOrWhiteSpace(id)
                ? $"id:{id.Trim()}"
                : !string.IsNullOrWhiteSpace(nom)
                    ? $"nom:{nom.Trim().ToLowerInvariant()}"
                    : string.Empty;

        static string BuildLabel(string? nom, string? id)
            => !string.IsNullOrWhiteSpace(nom)
                ? nom.Trim()
                : !string.IsNullOrWhiteSpace(id)
                    ? id.Trim()
                    : string.Empty;

        foreach (var article in articlesByEntreprise)
        {
            Console.WriteLine("=================================");
            Console.WriteLine($"ARTICLE : {article.Nom}");
            Console.WriteLine($"ORGANE JSON : {article.OrganeLinksJson}");
        }

        var linkedArticles = articlesByEntreprise
            .Where(article => !string.IsNullOrWhiteSpace(article.OrganeLinksJson))
            .Where(article =>
            {
                try
                {
                    var opts = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };
                    var links = JsonSerializer.Deserialize<List<ArticleOrganeLink>>(article.OrganeLinksJson!, opts);
                    return links?.Any(link => !string.IsNullOrWhiteSpace(link?.OrganeId) && link.OrganeId == organeId) == true;
                }
                catch
                {
                    return false;
                }
            })
            .ToList();

        object BuildArticleNode(dynamic article) => new
        {
            id = $"article-{article.Id}",
            type = "article",
            nom = string.IsNullOrWhiteSpace(article.Nom)
        ? article.Designation
        : article.Nom,
            code = article.Code,
            reference = article.ReferenceInterne,
            stockActuel = article.StockActuel ?? 0m,
            stockMinimum = article.StockMinimum ?? 0m,
            icon = "box",

            children = Array.Empty<object>()
        };

        object BuildSousFamilleNode(string? sousFamilleId, string? sousFamilleNom, IEnumerable<dynamic> items, string groupNodeKey, string familyNodeKey)
        {
            var itemList = items
                .Where(article => !assigned.Contains(article.Id))
                .ToList();

            foreach (var article in itemList)
            {
                assigned.Add(article.Id);
            }

            return new
            {
                id = $"sousfamillearticle-{organeId}-{groupNodeKey}-{familyNodeKey}-{NormalizeNodeKey(sousFamilleNom, sousFamilleId ?? "sans-sous")}",
                type = "sousFamilleArticle",
                nom = BuildLabel(sousFamilleNom, sousFamilleId),
                code = sousFamilleId,
                children = itemList.Select(BuildArticleNode).Cast<object>().ToList()
            };
        }

        object BuildFamilleNode(string? familleId, string? familleNom, IEnumerable<dynamic> items, string groupNodeKey)
        {
            var familyItems = items
                .Where(article => !assigned.Contains(article.Id))
                .ToList();

            var sousNodes = new List<object>();
            var groupedSousFamilles = familyItems
                .GroupBy(article => BuildKey((string?)article.SousFamilleId, (string?)article.SousFamilleNom))
                .Where(group => !string.IsNullOrWhiteSpace(group.Key))
                .OrderBy(group => group.Select(article => BuildLabel((string?)article.SousFamilleNom, (string?)article.SousFamilleId)).FirstOrDefault())
                .ToList();

            foreach (var sousGroup in groupedSousFamilles)
            {
                var first = sousGroup.First();
                sousNodes.Add(BuildSousFamilleNode(first.SousFamilleId, first.SousFamilleNom, sousGroup, groupNodeKey, NormalizeNodeKey(familleNom, familleId ?? "sans-famille")));
            }

            var directItems = familyItems
                .Where(article => string.IsNullOrWhiteSpace(BuildKey((string?)article.SousFamilleId, (string?)article.SousFamilleNom)))
                .ToList();
            if (directItems.Count > 0)
            {
                sousNodes.Add(BuildSousFamilleNode(null, "Sans sous-famille", directItems, groupNodeKey, NormalizeNodeKey(familleNom, familleId ?? "sans-famille")));
            }

            if (sousNodes.Count == 0)
            {
                return null!;
            }

            return new
            {
                id = $"famillearticle-{organeId}-{groupNodeKey}-{NormalizeNodeKey(familleNom, familleId ?? "sans-famille")}",
                type = "familleArticle",
                nom = BuildLabel(familleNom, familleId),
                code = familleId,
                children = sousNodes
            };
        }

        var groupedByGroup = linkedArticles
            .GroupBy(article => BuildKey((string?)article.GroupeId, (string?)article.GroupeNom))
            .Where(group => !string.IsNullOrWhiteSpace(group.Key))
            .OrderBy(group => group.Select(article => BuildLabel((string?)article.GroupeNom, (string?)article.GroupeId)).FirstOrDefault())
            .ToList();

        foreach (var group in groupedByGroup)
        {
            var first = group.First();
            var groupNodeKey = NormalizeNodeKey(first.GroupeNom, first.GroupeId ?? "groupe");
            var familyNodes = new List<object>();

            var groupedByFamily = group
                .GroupBy(article => BuildKey((string?)article.FamilleId, (string?)article.FamilleNom))
                .ToList();

            foreach (var familyGroup in groupedByFamily)
            {
                var firstFamily = familyGroup.First();
                var familyNode = BuildFamilleNode(firstFamily.FamilleId, firstFamily.FamilleNom, familyGroup, groupNodeKey);
                if (familyNode is not null)
                {
                    familyNodes.Add(familyNode);
                }
            }

            var directGroupItems = group
                .Where(article => string.IsNullOrWhiteSpace(BuildKey((string?)article.FamilleId, (string?)article.FamilleNom)))
                .ToList();
            if (directGroupItems.Count > 0)
            {
                familyNodes.Add(BuildFamilleNode(null, "Sans famille", directGroupItems, groupNodeKey));
            }

            if (familyNodes.Count > 0)
            {
                nodes.Add(new
                {
                    id = $"groupearticle-{organeId}-{groupNodeKey}",
                    type = "groupeArticle",
                    nom = BuildLabel(first.GroupeNom, first.GroupeId),
                    code = first.GroupeId,
                    children = familyNodes
                });
            }
        }

        var unassignedArticles = linkedArticles
            .Where(article => string.IsNullOrWhiteSpace(BuildKey((string?)article.GroupeId, (string?)article.GroupeNom)))
            .ToList();
        if (unassignedArticles.Count > 0)
        {
            var groupNodeKey = "non-classe";
            var familyNode = BuildFamilleNode(null, "Sans famille", unassignedArticles, groupNodeKey);
            nodes.Add(new
            {
                id = $"groupearticle-{organeId}-non-classe",
                type = "groupeArticle",
                nom = "Groupe non defini",
                code = (string?)null,
                children = familyNode is null ? new List<object>() : new List<object> { familyNode }
            });
        }

        return nodes;
    }

    Console.WriteLine($"UNITES: {unites.Count}");
    Console.WriteLine($"DIVISIONS: {divisions.Count}");
    Console.WriteLine($"DEPARTEMENTS: {departements.Count}");
    Console.WriteLine($"SERVICES: {services.Count}");
    Console.WriteLine($"EQUIPEMENTS: {equipements.Count}");
    Console.WriteLine($"ORGANES: {organes.Count}");

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
                                children = BuildEquipementHierarchy(
                                    service.Id,
                                    equipementsByService.TryGetValue(service.Id, out var serviceEquipements)
                                        ? serviceEquipements
                                        : new List<Equipement>())
                            }).ToList()
                            : new List<object>()
                    }).ToList()
                    : new List<object>()
            }).ToList()
            : new List<object>()
    }).ToList();


    var articlesGlobaux = articlesByEntreprise
        .Where(a => string.IsNullOrWhiteSpace(a.EquipementId)
                 && string.IsNullOrWhiteSpace(a.OrganeLinksJson))
        .ToList();

    object BuildArticleNodeGlobal(dynamic article) => new
    {
        id = $"article-{(string?)article.Id}",
        type = "article",
        nom = string.IsNullOrWhiteSpace((string?)article.Nom)
                           ? (string?)article.Designation
                           : (string?)article.Nom,
        code = (string?)article.Code,
        reference = (string?)article.ReferenceInterne,
        stockActuel = article.StockActuel ?? 0m,
        stockMinimum = article.StockMinimum ?? 0m,
        icon = "box",
        children = Array.Empty<object>()
    };

    object BuildSousFamilleGlobal(SousFamilleArticle sf)
    {
        var sfArticles = articlesGlobaux
            .Where(a => a.SousFamilleId == sf.Id)
            .Select(a => BuildArticleNodeGlobal(a))
            .Cast<object>()
            .ToList();

        return new
        {
            id = $"sousfamillearticle-global-{sf.Id}",
            type = "sousFamilleArticle",
            nom = sf.Nom,
            code = sf.Id,
            children = sfArticles
        };
    }

    object BuildFamilleGlobal(FamilleArticle fam)
    {
        var sfNodes = refSousFamillesArticles
            .Where(sf => sf.FamilleId == fam.Id)
            .OrderBy(sf => sf.Nom)
            .Select(sf => BuildSousFamilleGlobal(sf))
            .Cast<object>()
            .ToList();

        var directArticles = articlesGlobaux
            .Where(a => a.FamilleId == fam.Id
                     && string.IsNullOrWhiteSpace(a.SousFamilleId))
            .Select(a => BuildArticleNodeGlobal(a))
            .Cast<object>()
            .ToList();

        return new
        {
            id = $"famillearticle-global-{fam.Id}",
            type = "familleArticle",
            nom = fam.Nom,
            code = fam.Id,
            children = sfNodes.Concat(directArticles).ToList()
        };
    }

    var groupeArticleNodes = refGroupesArticles
        .OrderBy(grp => grp.Nom)
        .Select(grp =>
        {
            var famNodes = refFamillesArticles
                .Where(f => f.GroupeId == grp.Id)
                .OrderBy(f => f.Nom)
                .Select(fam => BuildFamilleGlobal(fam))
                .Cast<object>()
                .ToList();

            var directArticles = articlesGlobaux
                .Where(a => a.GroupeId == grp.Id
                         && string.IsNullOrWhiteSpace(a.FamilleId))
                .Select(a => BuildArticleNodeGlobal(a))
                .Cast<object>()
                .ToList();

            return (object)new
            {
                id = $"groupearticle-global-{grp.Id}",
                type = "groupeArticle",
                nom = grp.Nom,
                code = grp.Id,
                children = famNodes.Concat(directArticles).ToList()
            };
        })
        .ToList();

    var articlesNonClasses = articlesGlobaux
        .Where(a => string.IsNullOrWhiteSpace(a.GroupeId)
                 && string.IsNullOrWhiteSpace(a.GroupeNom))
        .ToList();

    if (articlesNonClasses.Any())
    {
        groupeArticleNodes.Add(new
        {
            id = $"groupearticle-global-non-classe",
            type = "groupeArticle",
            nom = "Non classifiÃ©s",
            code = (string?)null,
            children = articlesNonClasses
                           .Select(a => BuildArticleNodeGlobal(a))
                           .Cast<object>()
                           .ToList()
        });
    }
    Console.WriteLine(
        JsonSerializer.Serialize(
            uniteNodes,
            new JsonSerializerOptions
            {
                WriteIndented = true
            }
        )
    );

    var entrepriseChildren = uniteNodes.Cast<object>().ToList();
    if (refGroupesArticles.Any() || articlesNonClasses.Any())
    {
        entrepriseChildren.Add(new
        {
            id = $"articles-{entrepriseId}",
            type = "articlesRoot",
            nom = "Articles",
            icon = "box",
            children = groupeArticleNodes
        });
    }

    var result = new List<object>
    {
        new
        {
            id       = $"entreprise-{entrepriseId}",
            type     = "entreprise",
            nom      = entreprise?.Nom ?? "Entreprise",
            code     = entreprise?.Code ?? entrepriseId,
            icon     = "building",
            children = entrepriseChildren
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