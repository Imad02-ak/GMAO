namespace GMAO.Models;

public class Entreprise
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");

    public string Code { get; set; } = string.Empty;

    public string Nom { get; set; } = string.Empty;

    public string Wilaya { get; set; } = string.Empty;

    public string Daira { get; set; } = string.Empty;

    public string Commune { get; set; } = string.Empty;

    public DateTime? DateCreation { get; set; }

    public string Telephone { get; set; } = string.Empty;

    public ICollection<UserAccount> Utilisateurs { get; set; } = new List<UserAccount>();
}
