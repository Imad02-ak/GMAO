using System.ComponentModel.DataAnnotations;

namespace GMAO.Models;

public class Fournisseur : BaseEntity
{
    [Required] public string Code { get; set; } = string.Empty;
    [Required] public string Nom { get; set; } = string.Empty;
    public string Contact { get; set; } = string.Empty;
    public string Telephone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Adresse { get; set; } = string.Empty;
    public int DelaiMoyen { get; set; }
    public bool Actif { get; set; } = true;
    public string EntrepriseId { get; set; } = string.Empty;
    public ICollection<Article> Articles { get; set; } = new List<Article>();
    public ICollection<CommandeAchat> Commandes { get; set; } = new List<CommandeAchat>();
}
