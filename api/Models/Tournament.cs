namespace TournamentAPI.Models;

public class Tournament
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public string? Description { get; set; }
    public int MaxPlayers { get; set; }
    public DateTime Date { get; set; }

    // Foreign key for User (Tournament creator)
    public int UserId { get; set; }

    // Navigation properties
    public ApplicationUser? User { get; set; }
    public ICollection<Game> Games { get; set; } = new List<Game>();
}
