namespace GMAO.Models;

public class GroupeOrgane : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Nom { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string EntrepriseId { get; set; } = string.Empty;
    public ICollection<FamilleOrgane> Familles { get; set; } = new List<FamilleOrgane>();
}
