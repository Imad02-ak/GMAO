namespace GMAO.Models;

public class ArticleOrgane
{
    public string ArticleId { get; set; } = string.Empty;
    public Article? Article { get; set; }
    public string OrganeId { get; set; } = string.Empty;
    public Organe? Organe { get; set; }
    public double QteUtilisee { get; set; }
}
