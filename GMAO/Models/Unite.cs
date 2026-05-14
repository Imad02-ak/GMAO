using System.ComponentModel.DataAnnotations;

namespace GMAO.Models;

public class Unite : BaseEntity
{
    [Required] public string Code { get; set; } = string.Empty;
    [Required] public string Nom { get; set; } = string.Empty;
    public string Wilaya { get; set; } = string.Empty;
    public string Daira { get; set; } = string.Empty;
    public string Commune { get; set; } = string.Empty;
    public string Adresse { get; set; } = string.Empty;
    public string Directeur { get; set; } = string.Empty;
    public string Telephone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public string EntrepriseId { get; set; } = string.Empty;
    public Entreprise? Entreprise { get; set; }

    public ICollection<Division> Divisions { get; set; } = new List<Division>();
}
