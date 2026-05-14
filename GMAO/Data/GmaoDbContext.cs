using GMAO.Models;
using Microsoft.EntityFrameworkCore;

namespace GMAO.Data;

public class GmaoDbContext : DbContext
{
    public GmaoDbContext(DbContextOptions<GmaoDbContext> options) : base(options) { }

    public DbSet<Entreprise> Entreprises => Set<Entreprise>();
    public DbSet<Unite> Unites => Set<Unite>();
    public DbSet<Division> Divisions => Set<Division>();
    public DbSet<Departement> Departements => Set<Departement>();
    public DbSet<Service> Services => Set<Service>();
    public DbSet<GroupeEquipement> GroupesEquipement => Set<GroupeEquipement>();
    public DbSet<FamilleEquipement> FamillesEquipement => Set<FamilleEquipement>();
    public DbSet<SousFamilleEquipement> SousFamillesEquipement => Set<SousFamilleEquipement>();
    public DbSet<Equipement> Equipements => Set<Equipement>();
    public DbSet<SousEnsemble> SousEnsembles => Set<SousEnsemble>();
    public DbSet<GroupeOrgane> GroupesOrgane => Set<GroupeOrgane>();
    public DbSet<FamilleOrgane> FamillesOrgane => Set<FamilleOrgane>();
    public DbSet<SousFamilleOrgane> SousFamillesOrgane => Set<SousFamilleOrgane>();
    public DbSet<Organe> Organes => Set<Organe>();
    public DbSet<Composant> Composants => Set<Composant>();
    public DbSet<GroupeArticle> GroupesArticle => Set<GroupeArticle>();
    public DbSet<FamilleArticle> FamillesArticle => Set<FamilleArticle>();
    public DbSet<SousFamilleArticle> SousFamillesArticle => Set<SousFamilleArticle>();
    public DbSet<Article> Articles => Set<Article>();
    public DbSet<ArticleOrgane> ArticleOrganes => Set<ArticleOrgane>();
    public DbSet<Fournisseur> Fournisseurs => Set<Fournisseur>();
    public DbSet<MouvementStock> MouvementsStock => Set<MouvementStock>();
    public DbSet<CommandeAchat> CommandesAchat => Set<CommandeAchat>();
    public DbSet<CommandeLigne> CommandeLignes => Set<CommandeLigne>();
    public DbSet<Intervention> Interventions => Set<Intervention>();
    public DbSet<Utilisateur> Utilisateurs => Set<Utilisateur>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ArticleOrgane>().HasKey(ao => new { ao.ArticleId, ao.OrganeId });

        modelBuilder.Entity<Article>().Property(a => a.PrixUnitaire).HasPrecision(18, 2);
        modelBuilder.Entity<MouvementStock>().Property(m => m.ValeurMouvement).HasPrecision(18, 2);
        modelBuilder.Entity<CommandeLigne>().Property(c => c.TotalLigne).HasPrecision(18, 2);

        modelBuilder.Entity<Equipement>()
            .HasOne(e => e.Service)
            .WithMany(s => s.Equipements)
            .HasForeignKey(e => e.ServiceId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Organe>()
            .HasOne(o => o.SousEnsemble)
            .WithMany(se => se.Organes)
            .HasForeignKey(o => o.SousEnsembleId)
            .OnDelete(DeleteBehavior.Cascade);

        // Avoid SQL Server multiple cascade path conflicts on purchasing chain.
        modelBuilder.Entity<CommandeLigne>()
            .HasOne(cl => cl.Commande)
            .WithMany(c => c.Lignes)
            .HasForeignKey(cl => cl.CommandeId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<CommandeLigne>()
            .HasOne(cl => cl.Article)
            .WithMany(a => a.CommandeLignes)
            .HasForeignKey(cl => cl.ArticleId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Article>()
            .HasOne(a => a.Fournisseur)
            .WithMany(f => f.Articles)
            .HasForeignKey(a => a.FournisseurId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<CommandeAchat>()
            .HasOne(c => c.Fournisseur)
            .WithMany(f => f.Commandes)
            .HasForeignKey(c => c.FournisseurId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Equipement>().HasIndex(e => e.Tag).IsUnique();
        modelBuilder.Entity<Entreprise>().HasIndex(e => e.Code).IsUnique();
        modelBuilder.Entity<Utilisateur>().HasIndex(u => u.Email).IsUnique();
        modelBuilder.Entity<Article>().HasIndex(a => a.ReferenceInterne);
    }
}
