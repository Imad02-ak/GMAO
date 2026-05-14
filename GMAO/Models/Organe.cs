using System.ComponentModel.DataAnnotations;

namespace GMAO.Models;

public class Organe : BaseEntity
{
    [Required] public string Code { get; set; } = string.Empty;
    [Required] public string Nom { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string Marque { get; set; } = string.Empty;
    public string Reference { get; set; } = string.Empty;
    public string Fournisseur { get; set; } = string.Empty;
    public string ParametresNominaux { get; set; } = string.Empty;
    public string SeuilsAlarme { get; set; } = string.Empty;
    public string Statut { get; set; } = "En service";
    public DateTime? DateInstallation { get; set; }
    public DateTime? DateRemplacement { get; set; }
    public int? DureeVie { get; set; }
    public string DureeVieUnite { get; set; } = string.Empty;
    public decimal? PrixUnitaire { get; set; }
    public string PositionSurEquipement { get; set; } = string.Empty;
    public string DescriptionTechnique { get; set; } = string.Empty;

    public string SousEnsembleId { get; set; } = string.Empty;
    public SousEnsemble? SousEnsemble { get; set; }
    public string SousFamilleId { get; set; } = string.Empty;
    public SousFamilleOrgane? SousFamille { get; set; }

    public ICollection<Composant> Composants { get; set; } = new List<Composant>();
    public ICollection<ArticleOrgane> ArticleOrganes { get; set; } = new List<ArticleOrgane>();
}
