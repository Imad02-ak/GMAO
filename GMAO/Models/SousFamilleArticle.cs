namespace GMAO.Models;

public class SousFamilleArticle : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Nom { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string FamilleId { get; set; } = string.Empty;
    public FamilleArticle? Famille { get; set; }
    public ICollection<Article> Articles { get; set; } = new List<Article>();
}
