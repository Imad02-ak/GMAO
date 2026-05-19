namespace GMAO.Models;

public class UserAccount
{
    public string Id { get; set; } = Guid.NewGuid().ToString("N");

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public DateTime? BirthDate { get; set; }

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string EntrepriseId { get; set; } = string.Empty;

    public Entreprise? Entreprise { get; set; }
}
