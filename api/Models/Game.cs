namespace TournamentAPI.Models;

public class Game
{
    public int Id { get; set; }
    public required string Title { get; set; }
    public DateTime Time { get; set; }

    // Foreign keys
    public int TournamentId { get; set; }
    public int UserId { get; set; }

    // Navigation properties
    public required Tournament Tournament { get; set; }
    public ApplicationUser? User { get; set; }
}
