namespace GMAO.Models;

public class Service
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");

    public string Code { get; set; } = string.Empty;

    public string Nom { get; set; } = string.Empty;

    public string Chef { get; set; } = string.Empty;

    public string Telephone { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string DepartementId { get; set; } = string.Empty;

    public Departement? Departement { get; set; }

    public ICollection<Equipement> Equipements { get; set; } = new List<Equipement>();
}
