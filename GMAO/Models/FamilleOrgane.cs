namespace GMAO.Models;

public class FamilleOrgane : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Nom { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string GroupeId { get; set; } = string.Empty;
    public GroupeOrgane? Groupe { get; set; }
    public ICollection<SousFamilleOrgane> SousFamilles { get; set; } = new List<SousFamilleOrgane>();
}
