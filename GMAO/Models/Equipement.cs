namespace GMAO.Models;

public class Equipement
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");

    public string Code { get; set; } = string.Empty;

    public string Nom { get; set; } = string.Empty;

    public string? Marque { get; set; }

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

    public string? DocumentsJson { get; set; }

    public string? GroupeId { get; set; }

    public string? GroupeNom { get; set; }

    public string? FamilleId { get; set; }

    public string? FamilleNom { get; set; }

    public string? SousFamilleId { get; set; }

    public string? SousFamilleNom { get; set; }

    public string? Tag { get; set; }

    public string? ServiceId { get; set; }

    public Service? Service { get; set; }

    public ICollection<Article> Articles { get; set; } = new List<Article>();
}
