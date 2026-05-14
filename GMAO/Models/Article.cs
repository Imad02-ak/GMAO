using System.ComponentModel.DataAnnotations;

namespace GMAO.Models;

public class Article : BaseEntity
{
    [Required] public string Code { get; set; } = string.Empty;
    [Required] public string Designation { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string UniteMesure { get; set; } = string.Empty;
    public string ReferenceInterne { get; set; } = string.Empty;
    public string ReferenceFabricant { get; set; } = string.Empty;
    public string Marque { get; set; } = string.Empty;
    public string FournisseurId { get; set; } = string.Empty;
    public Fournisseur? Fournisseur { get; set; }
    public double StockActuel { get; set; }
    public double StockMinimum { get; set; }
    public double StockCritique { get; set; }
    public double QteReapprovisionnement { get; set; }
    public decimal PrixUnitaire { get; set; }
    public string EmplacementStock { get; set; } = string.Empty;
    public string Notes { get; set; } = string.Empty;
    public string SousFamilleId { get; set; } = string.Empty;
    public SousFamilleArticle? SousFamille { get; set; }

    public ICollection<MouvementStock> Mouvements { get; set; } = new List<MouvementStock>();
    public ICollection<ArticleOrgane> ArticleOrganes { get; set; } = new List<ArticleOrgane>();
    public ICollection<CommandeLigne> CommandeLignes { get; set; } = new List<CommandeLigne>();
}
