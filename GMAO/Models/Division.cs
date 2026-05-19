namespace GMAO.Models;

public class Division
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");

    public string Code { get; set; } = string.Empty;

    public string Nom { get; set; } = string.Empty;

    public string Responsable { get; set; } = string.Empty;

    public string Telephone { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string UniteId { get; set; } = string.Empty;

    public Unite? Unite { get; set; }

    public ICollection<Departement> Departements { get; set; } = new List<Departement>();
}
