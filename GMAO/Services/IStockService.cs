using GMAO.Models;

namespace GMAO.Services;

public interface IStockService
{
    Task<List<Article>> GetArticlesAsync(string entrepriseId);
    Task<List<MouvementStock>> GetMouvementsAsync(string entrepriseId);
    Task<List<CommandeAchat>> GetCommandesAsync(string entrepriseId);
    Task<List<Fournisseur>> GetFournisseursAsync(string entrepriseId);
    Task SaveMouvementAsync(MouvementStock mouvement);
    Task UpdateStockAsync(string articleId, double newQty);
    Task SaveArticleAsync(Article article);
    Task SaveCommandeAsync(CommandeAchat commande);
}
