using System.ComponentModel.DataAnnotations;

namespace GMAO.Models;

public class SousFamilleEquipement : BaseEntity
{
    [Required] public string Code { get; set; } = string.Empty;
    [Required] public string Nom { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string FamilleId { get; set; } = string.Empty;
    public FamilleEquipement? Famille { get; set; }
    public ICollection<Equipement> Equipements { get; set; } = new List<Equipement>();
}
