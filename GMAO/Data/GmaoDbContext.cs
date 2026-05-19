using GMAO.Models;
using Microsoft.EntityFrameworkCore;

namespace GMAO.Data;

public class GmaoDbContext : DbContext
{
    public GmaoDbContext(DbContextOptions<GmaoDbContext> options)
        : base(options)
    {
    }

    public DbSet<Entreprise> Entreprises => Set<Entreprise>();

    public DbSet<UserAccount> UserAccounts => Set<UserAccount>();

    public DbSet<Unite> Unites => Set<Unite>();

    public DbSet<Division> Divisions => Set<Division>();

    public DbSet<Departement> Departements => Set<Departement>();

    public DbSet<Service> Services => Set<Service>();

    public DbSet<Equipement> Equipements => Set<Equipement>();
    public DbSet<GroupeEquipement> GroupesEquipements => Set<GroupeEquipement>();
    public DbSet<FamilleEquipement> FamillesEquipements => Set<FamilleEquipement>();
    public DbSet<SousFamilleEquipement> SousFamillesEquipements => Set<SousFamilleEquipement>();

    public DbSet<Article> Articles => Set<Article>();
    public DbSet<GroupeArticle> GroupesArticles => Set<GroupeArticle>();
    public DbSet<FamilleArticle> FamillesArticles => Set<FamilleArticle>();
    public DbSet<SousFamilleArticle> SousFamillesArticles => Set<SousFamilleArticle>();

    public DbSet<Organe> Organes => Set<Organe>();
    public DbSet<GroupeOrgane> GroupesOrganes => Set<GroupeOrgane>();
    public DbSet<FamilleOrgane> FamillesOrganes => Set<FamilleOrgane>();
    public DbSet<SousFamilleOrgane> SousFamillesOrganes => Set<SousFamilleOrgane>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Entreprise>()
            .HasIndex(e => e.Code)
            .IsUnique();

        modelBuilder.Entity<UserAccount>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<UserAccount>()
            .HasOne(u => u.Entreprise)
            .WithMany(e => e.Utilisateurs)
            .HasForeignKey(u => u.EntrepriseId);

        modelBuilder.Entity<Unite>()
            .HasIndex(u => u.EntrepriseId);

        modelBuilder.Entity<Division>()
            .HasIndex(d => d.UniteId);

        modelBuilder.Entity<Departement>()
            .HasIndex(d => d.DivisionId);

        modelBuilder.Entity<Service>()
            .HasIndex(s => s.DepartementId);

        modelBuilder.Entity<Equipement>()
            .HasIndex(e => e.ServiceId);

        modelBuilder.Entity<Equipement>()
            .Property(e => e.PrixAchat)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Article>()
            .ToTable("SousEnsembles");

        modelBuilder.Entity<Article>()
            .HasIndex(article => article.EquipementId);

        modelBuilder.Entity<Article>()
            .Property(article => article.PrixUnitaire)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Article>()
            .Property(article => article.StockActuel)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Article>()
            .Property(article => article.StockMinimum)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Article>()
            .Property(article => article.StockCritique)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Article>()
            .Property(article => article.QteReapprovisionnement)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Article>()
            .Property(article => article.ValeurTotale)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Organe>()
            .HasIndex(o => o.SousEnsembleId);

        modelBuilder.Entity<FamilleEquipement>()
            .HasIndex(f => f.GroupeId);

        modelBuilder.Entity<SousFamilleEquipement>()
            .HasIndex(s => s.FamilleId);

        modelBuilder.Entity<FamilleOrgane>()
            .HasIndex(f => f.GroupeId);

        modelBuilder.Entity<SousFamilleOrgane>()
            .HasIndex(s => s.FamilleId);

        modelBuilder.Entity<FamilleArticle>()
            .HasIndex(f => f.GroupeId);

        modelBuilder.Entity<SousFamilleArticle>()
            .HasIndex(s => s.FamilleId);

        modelBuilder.Entity<Organe>()
            .Property(o => o.PrixUnitaire)
            .HasPrecision(18, 2);
    }
}
