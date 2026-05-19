namespace GMAO.Models;

public class FamilleOrgane
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string Code { get; set; } = string.Empty;
    public string Nom { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? GroupeId { get; set; }
}
