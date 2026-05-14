using System.ComponentModel.DataAnnotations;

namespace GMAO.Models;

public class Entreprise : BaseEntity
{
    [Required] public string Nom { get; set; } = string.Empty;
    [Required] public string Code { get; set; } = string.Empty;
    public string Wilaya { get; set; } = string.Empty;
    public string Daira { get; set; } = string.Empty;
    public string Commune { get; set; } = string.Empty;
    public string Adresse { get; set; } = string.Empty;
    public string Telephone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime DateCreation { get; set; } = DateTime.UtcNow;

    public ICollection<Unite> Unites { get; set; } = new List<Unite>();
    public ICollection<Utilisateur> Utilisateurs { get; set; } = new List<Utilisateur>();
}
