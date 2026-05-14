using System.ComponentModel.DataAnnotations;

namespace GMAO.Models;

public class SousEnsemble : BaseEntity
{
    [Required] public string Code { get; set; } = string.Empty;
    [Required] public string Nom { get; set; } = string.Empty;
    public string FonctionPrincipale { get; set; } = string.Empty;
    public bool Remplacable { get; set; }
    public string Description { get; set; } = string.Empty;

    public string EquipementId { get; set; } = string.Empty;
    public Equipement? Equipement { get; set; }
    public ICollection<Organe> Organes { get; set; } = new List<Organe>();
}
