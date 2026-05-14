using System.ComponentModel.DataAnnotations;

namespace GMAO.Models;

public class Utilisateur : BaseEntity
{
    [Required] public string Prenom { get; set; } = string.Empty;
    [Required] public string Nom { get; set; } = string.Empty;
    [Required, EmailAddress] public string Email { get; set; } = string.Empty;
    public string MotDePasseHash { get; set; } = string.Empty;
    public DateTime DateNaissance { get; set; }
    public string Role { get; set; } = "Technicien";
    public string Statut { get; set; } = "EN_ATTENTE";
    public string EntrepriseId { get; set; } = string.Empty;
    public Entreprise? Entreprise { get; set; }
}
