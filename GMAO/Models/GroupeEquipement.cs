using System.ComponentModel.DataAnnotations;

namespace GMAO.Models;

public class GroupeEquipement : BaseEntity
{
    [Required] public string Code { get; set; } = string.Empty;
    [Required] public string Nom { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string EntrepriseId { get; set; } = string.Empty;
    public ICollection<FamilleEquipement> Familles { get; set; } = new List<FamilleEquipement>();
}
