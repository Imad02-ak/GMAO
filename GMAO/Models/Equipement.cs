using System.ComponentModel.DataAnnotations;

namespace GMAO.Models;

public class Equipement : BaseEntity
{
    [Required] public string Tag { get; set; } = string.Empty;
    [Required] public string Nom { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Marque { get; set; } = string.Empty;
    public string Modele { get; set; } = string.Empty;
    public string NumeroSerie { get; set; } = string.Empty;
    public string Fournisseur { get; set; } = string.Empty;
    public DateTime? DateAchat { get; set; }
    public DateTime? DateMiseEnService { get; set; }
    public DateTime? DateFinGarantie { get; set; }
    public decimal? PrixAchat { get; set; }
    public decimal? ValeurActuelle { get; set; }
    public int? DureeVie { get; set; }
    public string DureeVieUnite { get; set; } = string.Empty;
    public string Statut { get; set; } = "En service";
    public int Criticite { get; set; } = 3;
    public string Localisation { get; set; } = string.Empty;
    public string Batiment { get; set; } = string.Empty;
    public string Salle { get; set; } = string.Empty;
    public string Ligne { get; set; } = string.Empty;
    public double CompteurHeures { get; set; }
    public double CompteurCycles { get; set; }
    public double CompteurDistance { get; set; }
    public double? SeuilAlerte { get; set; }

    public string? ServiceId { get; set; }
    public Service? Service { get; set; }
    public string SousFamilleId { get; set; } = string.Empty;
    public SousFamilleEquipement? SousFamille { get; set; }
    public string EntrepriseId { get; set; } = string.Empty;

    public ICollection<SousEnsemble> SousEnsembles { get; set; } = new List<SousEnsemble>();
    public ICollection<Intervention> Interventions { get; set; } = new List<Intervention>();
}
