using GMAO.Models;

namespace GMAO.Services;

public interface IEquipementService
{
    Task<List<Equipement>> GetEquipementsAsync(string entrepriseId);
    Task<Equipement?> GetEquipementDetailAsync(string id);
    Task<List<SousEnsemble>> GetSousEnsemblesAsync(string equipementId);
    Task<List<Organe>> GetOrganesAsync(string sousEnsembleId);
    Task<List<Intervention>> GetInterventionsAsync(string equipementId);
    Task SaveInterventionAsync(Intervention intervention);
    Task SaveEquipementAsync(Equipement equipement);
}
