namespace GMAO.Models;

public class Departement
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");

    public string Code { get; set; } = string.Empty;

    public string Nom { get; set; } = string.Empty;

    public string Chef { get; set; } = string.Empty;

    public string Telephone { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string DivisionId { get; set; } = string.Empty;

    public Division? Division { get; set; }

    public ICollection<Service> Services { get; set; } = new List<Service>();
}
