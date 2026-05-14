using GMAO.Models;

namespace GMAO.Services;

public interface IOrganisationService
{
    Task<Entreprise?> GetEntrepriseAsync(string id);
    Task<List<Unite>> GetUnitesAsync(string entrepriseId);
    Task<List<Division>> GetDivisionsAsync(string uniteId);
    Task<List<Departement>> GetDepartementsAsync(string divisionId);
    Task<List<Service>> GetServicesAsync(string departementId);
    Task SaveUniteAsync(Unite unite);
}
