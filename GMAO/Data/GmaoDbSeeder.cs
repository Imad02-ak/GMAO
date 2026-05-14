using GMAO.Models;
using Microsoft.EntityFrameworkCore;

namespace GMAO.Data;

public static class GmaoDbSeeder
{
    public static void Seed(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<GmaoDbContext>();
        db.Database.Migrate();

        if (db.Entreprises.Any()) return;

        var entreprise = new Entreprise
        {
            Nom = "Entreprise Nationale",
            Code = "4@gml",
            DateCreation = DateTime.UtcNow
        };
        db.Entreprises.Add(entreprise);

        var unite = new Unite { Code = "UP-001", Nom = "Unite Principale", EntrepriseId = entreprise.Id };
        var division = new Division { Code = "DIV-001", Nom = "Division Maintenance", UniteId = unite.Id };
        var departement = new Departement { Code = "DEP-001", Nom = "Departement Electromecanique", DivisionId = division.Id };
        var service = new Service { Code = "SRV-001", Nom = "Service Atelier", DepartementId = departement.Id };
        db.AddRange(unite, division, departement, service);

        var grpEq = new GroupeEquipement { Code = "GE-001", Nom = "Machines", EntrepriseId = entreprise.Id };
        var famEq = new FamilleEquipement { Code = "FE-001", Nom = "Pompes", GroupeId = grpEq.Id };
        var sfEq = new SousFamilleEquipement { Code = "SFE-001", Nom = "Pompes centrifuges", FamilleId = famEq.Id };
        db.AddRange(grpEq, famEq, sfEq);

        var equip = new Equipement
        {
            Tag = "PMP-001",
            Nom = "Pompe principale",
            EntrepriseId = entreprise.Id,
            ServiceId = service.Id,
            SousFamilleId = sfEq.Id,
            DateMiseEnService = new DateTime(2021, 3, 12, 0, 0, 0, DateTimeKind.Utc)
        };
        db.Equipements.Add(equip);

        db.Interventions.AddRange(
            new Intervention
            {
                EquipementId = equip.Id,
                Type = "PANNE",
                Motif = "Défaillance joint d'étanchéité",
                DateArret = new DateTime(2024, 6, 10, 9, 0, 0, DateTimeKind.Utc),
                DateReprise = new DateTime(2024, 6, 11, 14, 0, 0, DateTimeKind.Utc),
                DureeReelleHeures = 29,
                Statut = "CLOTURE",
                EntrepriseId = entreprise.Id
            },
            new Intervention
            {
                EquipementId = equip.Id,
                Type = "MAINTENANCE",
                Motif = "Révision générale programmée",
                DateArret = new DateTime(2026, 4, 28, 8, 0, 0, DateTimeKind.Utc),
                Statut = "EN_COURS",
                EntrepriseId = entreprise.Id
            });

        var grpArt = new GroupeArticle { Code = "GA-001", Nom = "Roulements", EntrepriseId = entreprise.Id };
        var famArt = new FamilleArticle { Code = "FA-001", Nom = "Roulements standard", GroupeId = grpArt.Id };
        var sfArt = new SousFamilleArticle { Code = "SFA-001", Nom = "Roulement radial", FamilleId = famArt.Id };
        var frs = new Fournisseur { Code = "FRN-001", Nom = "SKF Algérie", EntrepriseId = entreprise.Id };
        db.AddRange(grpArt, famArt, sfArt, frs);

        var article = new Article
        {
            Code = "ART-001",
            Designation = "Roulement SKF 6205",
            SousFamilleId = sfArt.Id,
            FournisseurId = frs.Id,
            StockActuel = 5,
            StockMinimum = 3,
            StockCritique = 1,
            PrixUnitaire = 4500
        };
        db.Articles.Add(article);

        db.MouvementsStock.Add(new MouvementStock
        {
            ArticleId = article.Id,
            Type = "ENTREE",
            Motif = "REAPPROVISIONNEMENT",
            Quantite = 10,
            QuantiteAvant = 5,
            QuantiteApres = 15,
            PrixUnitaire = 4500,
            ValeurMouvement = 45000,
            EntrepriseId = entreprise.Id,
            SaisiPar = "Admin"
        });

        db.SaveChanges();
    }
}
