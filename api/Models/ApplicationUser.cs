using Microsoft.AspNetCore.Identity;

namespace TournamentAPI.Models;

public class ApplicationUser : IdentityUser<int>
{
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    
    // Navigation properties
    public ICollection<Tournament> Tournaments { get; set; } = new List<Tournament>();
    public ICollection<Game> Games { get; set; } = new List<Game>();
}
