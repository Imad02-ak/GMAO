using System.ComponentModel.DataAnnotations;

namespace GMAO.Models;

public class FamilleEquipement : BaseEntity
{
    [Required] public string Code { get; set; } = string.Empty;
    [Required] public string Nom { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string GroupeId { get; set; } = string.Empty;
    public GroupeEquipement? Groupe { get; set; }
    public ICollection<SousFamilleEquipement> SousFamilles { get; set; } = new List<SousFamilleEquipement>();
}
