namespace GMAO.Models;

public class GroupeOrgane
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");
    public string Code { get; set; } = string.Empty;
    public string Nom { get; set; } = string.Empty;
    public string? Description { get; set; }
}
