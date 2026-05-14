namespace GMAO.Models;

public class CommandeLigne : BaseEntity
{
    public string CommandeId { get; set; } = string.Empty;
    public CommandeAchat? Commande { get; set; }
    public string ArticleId { get; set; } = string.Empty;
    public Article? Article { get; set; }
    public double QtCommandee { get; set; }
    public double QtLivree { get; set; }
    public decimal PrixUnitaire { get; set; }
    public decimal TotalLigne { get; set; }
}
