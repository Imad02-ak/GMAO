namespace GMAO.Models;

public class Article
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");

    public string Code { get; set; } = string.Empty;

    public string Nom { get; set; } = string.Empty;

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

    public string? DocumentsJson { get; set; }

    public string? Notes { get; set; }

    public string? GroupeId { get; set; }

    public string? GroupeNom { get; set; }

    public string? FamilleId { get; set; }

    public string? FamilleNom { get; set; }

    public string? SousFamilleId { get; set; }

    public string? SousFamilleNom { get; set; }

    public string? OrganeLinksJson { get; set; }

    public string? EquipementId { get; set; }

    public Equipement? Equipement { get; set; }

    public ICollection<Organe> Organes { get; set; } = new List<Organe>();

    public string? EntrepriseId { get; set; }
}
