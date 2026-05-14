using System.ComponentModel.DataAnnotations;

namespace GMAO.Models;

public class Division : BaseEntity
{
    [Required] public string Code { get; set; } = string.Empty;
    [Required] public string Nom { get; set; } = string.Empty;
    public string Wilaya { get; set; } = string.Empty;
    public string Daira { get; set; } = string.Empty;
    public string Commune { get; set; } = string.Empty;
    public string Adresse { get; set; } = string.Empty;
    public string Responsable { get; set; } = string.Empty;
    public string Telephone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public string UniteId { get; set; } = string.Empty;
    public Unite? Unite { get; set; }
    public ICollection<Departement> Departements { get; set; } = new List<Departement>();
}
