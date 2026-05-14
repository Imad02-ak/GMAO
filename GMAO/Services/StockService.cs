using GMAO.Data;
using GMAO.Models;
using Microsoft.EntityFrameworkCore;

namespace GMAO.Services;

public class StockService : IStockService
{
    private readonly GmaoDbContext _db;

    public StockService(GmaoDbContext db) => _db = db;

    public Task<List<Article>> GetArticlesAsync(string entrepriseId) =>
        _db.Articles.AsNoTracking()
            .Include(a => a.Fournisseur)
            .Include(a => a.ArticleOrganes)
            .Where(a => a.CreatedBy == entrepriseId || a.CreatedBy == string.Empty)
            .ToListAsync();

    public Task<List<MouvementStock>> GetMouvementsAsync(string entrepriseId) =>
        _db.MouvementsStock.AsNoTracking()
            .Include(m => m.Article)
            .Where(m => m.EntrepriseId == entrepriseId)
            .ToListAsync();

    public Task<List<CommandeAchat>> GetCommandesAsync(string entrepriseId) =>
        _db.CommandesAchat.AsNoTracking()
            .Include(c => c.Fournisseur)
            .Include(c => c.Lignes)
            .Where(c => c.EntrepriseId == entrepriseId)
            .ToListAsync();

    public Task<List<Fournisseur>> GetFournisseursAsync(string entrepriseId) =>
        _db.Fournisseurs.AsNoTracking().Where(f => f.EntrepriseId == entrepriseId).ToListAsync();

    public async Task SaveMouvementAsync(MouvementStock mouvement)
    {
        mouvement.Id = string.IsNullOrWhiteSpace(mouvement.Id) ? Guid.NewGuid().ToString() : mouvement.Id;
        _db.MouvementsStock.Add(mouvement);
        await _db.SaveChangesAsync();
    }

    public async Task UpdateStockAsync(string articleId, double newQty)
    {
        var article = await _db.Articles.FirstOrDefaultAsync(a => a.Id == articleId);
        if (article is null) return;
        article.StockActuel = newQty;
        article.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
    }

    public async Task SaveArticleAsync(Article article)
    {
        article.Id = string.IsNullOrWhiteSpace(article.Id) ? Guid.NewGuid().ToString() : article.Id;
        _db.Articles.Add(article);
        await _db.SaveChangesAsync();
    }

    public async Task SaveCommandeAsync(CommandeAchat commande)
    {
        commande.Id = string.IsNullOrWhiteSpace(commande.Id) ? Guid.NewGuid().ToString() : commande.Id;
        _db.CommandesAchat.Add(commande);
        await _db.SaveChangesAsync();
    }
}
