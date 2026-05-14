using System.ComponentModel.DataAnnotations;

namespace GMAO.Models;

public class Intervention : BaseEntity
{
    [Required] public string EquipementId { get; set; } = string.Empty;
    public Equipement? Equipement { get; set; }
    [Required] public string Type { get; set; } = string.Empty;
    public string Motif { get; set; } = string.Empty;
    public DateTime DateArret { get; set; }
    public DateTime? DateReprise { get; set; }
    public double? DureeReelleHeures { get; set; }
    public string Statut { get; set; } = "EN_COURS";
    public string SaisiPar { get; set; } = string.Empty;
    public string Observation { get; set; } = string.Empty;
    public string EntrepriseId { get; set; } = string.Empty;
}
