using System.ComponentModel.DataAnnotations;

namespace GMAO.Models;

public class MouvementStock : BaseEntity
{
    [Required] public string ArticleId { get; set; } = string.Empty;
    public Article? Article { get; set; }
    [Required] public string Type { get; set; } = string.Empty;
    public string Motif { get; set; } = string.Empty;
    public double Quantite { get; set; }
    public double QuantiteAvant { get; set; }
    public double QuantiteApres { get; set; }
    public decimal PrixUnitaire { get; set; }
    public decimal ValeurMouvement { get; set; }
    public string OtId { get; set; } = string.Empty;
    public string OtNumero { get; set; } = string.Empty;
    public string BtId { get; set; } = string.Empty;
    public string BtNumero { get; set; } = string.Empty;
    public string FournisseurId { get; set; } = string.Empty;
    public string NumeroBC { get; set; } = string.Empty;
    public string NumeroBL { get; set; } = string.Empty;
    public DateTime DateMouvement { get; set; } = DateTime.UtcNow;
    public string SaisiPar { get; set; } = string.Empty;
    public string Observation { get; set; } = string.Empty;
    public string EntrepriseId { get; set; } = string.Empty;
}
