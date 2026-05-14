namespace GMAO.Models;

public class FamilleArticle : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Nom { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string GroupeId { get; set; } = string.Empty;
    public GroupeArticle? Groupe { get; set; }
    public ICollection<SousFamilleArticle> SousFamilles { get; set; } = new List<SousFamilleArticle>();
}
