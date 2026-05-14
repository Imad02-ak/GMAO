using GMAO.Data;
using GMAO.Models;
using Microsoft.EntityFrameworkCore;

namespace GMAO.Services;

public class EquipementService : IEquipementService
{
    private readonly GmaoDbContext _db;

    public EquipementService(GmaoDbContext db) => _db = db;

    public Task<List<Equipement>> GetEquipementsAsync(string entrepriseId) =>
        _db.Equipements.AsNoTracking()
            .Include(e => e.Service)
            .Include(e => e.SousFamille)
            .Where(e => e.EntrepriseId == entrepriseId)
            .ToListAsync();

    public Task<Equipement?> GetEquipementDetailAsync(string id) =>
        _db.Equipements.AsNoTracking()
            .Include(e => e.Service)
            .Include(e => e.SousEnsembles)
            .Include(e => e.Interventions)
            .FirstOrDefaultAsync(e => e.Id == id);

    public Task<List<SousEnsemble>> GetSousEnsemblesAsync(string equipementId) =>
        _db.SousEnsembles.AsNoTracking()
            .Include(se => se.Organes)
            .Where(se => se.EquipementId == equipementId)
            .ToListAsync();

    public Task<List<Organe>> GetOrganesAsync(string sousEnsembleId) =>
        _db.Organes.AsNoTracking()
            .Include(o => o.ArticleOrganes)
            .Where(o => o.SousEnsembleId == sousEnsembleId)
            .ToListAsync();

    public Task<List<Intervention>> GetInterventionsAsync(string equipementId) =>
        _db.Interventions.AsNoTracking().Where(i => i.EquipementId == equipementId).ToListAsync();

    public async Task SaveInterventionAsync(Intervention intervention)
    {
        intervention.Id = string.IsNullOrWhiteSpace(intervention.Id) ? Guid.NewGuid().ToString() : intervention.Id;
        _db.Interventions.Add(intervention);
        await _db.SaveChangesAsync();
    }

    public async Task SaveEquipementAsync(Equipement equipement)
    {
        equipement.Id = string.IsNullOrWhiteSpace(equipement.Id) ? Guid.NewGuid().ToString() : equipement.Id;
        _db.Equipements.Add(equipement);
        await _db.SaveChangesAsync();
    }
}
