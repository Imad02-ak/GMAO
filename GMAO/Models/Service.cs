using System.ComponentModel.DataAnnotations;

namespace GMAO.Models;

public class Service : BaseEntity
{
    [Required] public string Code { get; set; } = string.Empty;
    [Required] public string Nom { get; set; } = string.Empty;
    public string Wilaya { get; set; } = string.Empty;
    public string Daira { get; set; } = string.Empty;
    public string Commune { get; set; } = string.Empty;
    public string Batiment { get; set; } = string.Empty;
    public string Adresse { get; set; } = string.Empty;
    public string Chef { get; set; } = string.Empty;
    public string Telephone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public string DepartementId { get; set; } = string.Empty;
    public Departement? Departement { get; set; }
    public ICollection<Equipement> Equipements { get; set; } = new List<Equipement>();
}
