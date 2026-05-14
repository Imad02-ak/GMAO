using System.ComponentModel.DataAnnotations;

namespace GMAO.Models;

public class Composant : BaseEntity
{
    [Required] public string Code { get; set; } = string.Empty;
    [Required] public string Nom { get; set; } = string.Empty;
    public string Matiere { get; set; } = string.Empty;
    public string Dimensions { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public string OrganeId { get; set; } = string.Empty;
    public Organe? Organe { get; set; }
    public ICollection<Article> Articles { get; set; } = new List<Article>();
}
