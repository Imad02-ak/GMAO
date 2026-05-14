namespace GMAO.Models;

public class SousFamilleOrgane : BaseEntity
{
    public string Code { get; set; } = string.Empty;
    public string Nom { get; set; } = string.Empty;
    public string Designation { get; set; } = string.Empty;
    public string FamilleId { get; set; } = string.Empty;
    public FamilleOrgane? Famille { get; set; }
    public ICollection<Organe> Organes { get; set; } = new List<Organe>();
}
