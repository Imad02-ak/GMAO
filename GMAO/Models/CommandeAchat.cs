using System.ComponentModel.DataAnnotations;

namespace GMAO.Models;

public class CommandeAchat : BaseEntity
{
    [Required] public string Numero { get; set; } = string.Empty;
    public string FournisseurId { get; set; } = string.Empty;
    public Fournisseur? Fournisseur { get; set; }
    public string Statut { get; set; } = "EN_ATTENTE";
    public DateTime DateCommande { get; set; }
    public DateTime? DateLivraisonPrevue { get; set; }
    public DateTime? DateLivraisonReelle { get; set; }
    public decimal MontantTotal { get; set; }
    public string Observations { get; set; } = string.Empty;
    public string EntrepriseId { get; set; } = string.Empty;
    public ICollection<CommandeLigne> Lignes { get; set; } = new List<CommandeLigne>();
}
