namespace GMAO.Models;

public class Organe
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");

    public string Nom { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public string? GroupeId { get; set; }

    public string? GroupeNom { get; set; }

    public string? FamilleId { get; set; }

    public string? FamilleNom { get; set; }

    public string? SousFamilleId { get; set; }

    public string? SousFamilleNom { get; set; }

    public string EquipementId { get; set; } = string.Empty;

    public string? EquipementNom { get; set; }

    public string? EquipementCode { get; set; }

    public Equipement? Equipement { get; set; }

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

    public string? DocumentsJson { get; set; }

    public string? Notes { get; set; }

    public string? SousEnsembleId { get; set; }

    public Article? SousEnsemble { get; set; }
}
