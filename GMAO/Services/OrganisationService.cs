using GMAO.Data;
using GMAO.Models;
using Microsoft.EntityFrameworkCore;

namespace GMAO.Services;

public class OrganisationService : IOrganisationService
{
    private readonly GmaoDbContext _db;

    public OrganisationService(GmaoDbContext db) => _db = db;

    public Task<Entreprise?> GetEntrepriseAsync(string id) =>
        _db.Entreprises.AsNoTracking().FirstOrDefaultAsync(e => e.Id == id);

    public Task<List<Unite>> GetUnitesAsync(string entrepriseId) =>
        _db.Unites.AsNoTracking().Where(u => u.EntrepriseId == entrepriseId).ToListAsync();

    public Task<List<Division>> GetDivisionsAsync(string uniteId) =>
        _db.Divisions.AsNoTracking().Where(d => d.UniteId == uniteId).ToListAsync();

    public Task<List<Departement>> GetDepartementsAsync(string divisionId) =>
        _db.Departements.AsNoTracking().Where(d => d.DivisionId == divisionId).ToListAsync();

    public Task<List<Service>> GetServicesAsync(string departementId) =>
        _db.Services.AsNoTracking().Where(s => s.DepartementId == departementId).ToListAsync();

    public async Task SaveUniteAsync(Unite unite)
    {
        if (string.IsNullOrWhiteSpace(unite.Id) || await _db.Unites.AsNoTracking().AllAsync(u => u.Id != unite.Id))
        {
            unite.Id = Guid.NewGuid().ToString();
            _db.Unites.Add(unite);
        }
        else
        {
            _db.Unites.Update(unite);
        }

        await _db.SaveChangesAsync();
    }
}
