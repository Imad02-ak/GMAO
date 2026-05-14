using System.ComponentModel.DataAnnotations;

namespace GMAO.Models;

public class Departement : BaseEntity
{
    [Required] public string Code { get; set; } = string.Empty;
    [Required] public string Nom { get; set; } = string.Empty;
    public string Wilaya { get; set; } = string.Empty;
    public string Daira { get; set; } = string.Empty;
    public string Commune { get; set; } = string.Empty;
    public string Adresse { get; set; } = string.Empty;
    public string Chef { get; set; } = string.Empty;
    public string Telephone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    public string DivisionId { get; set; } = string.Empty;
    public Division? Division { get; set; }
    public ICollection<Service> Services { get; set; } = new List<Service>();
}
