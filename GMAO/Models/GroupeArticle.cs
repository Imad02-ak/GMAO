namespace GMAO.Models;

public class GroupeArticle : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Nom { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string EntrepriseId { get; set; } = string.Empty;
    public ICollection<FamilleArticle> Familles { get; set; } = new List<FamilleArticle>();
}
