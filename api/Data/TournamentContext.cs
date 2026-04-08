using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TournamentAPI.Models;

namespace TournamentAPI.Data;

public class TournamentContext : IdentityDbContext<ApplicationUser, IdentityRole<int>, int>
{
    public TournamentContext(DbContextOptions<TournamentContext> options) : base(options)
    {
    }

    public DbSet<Tournament> Tournaments { get; set; }
    public DbSet<Game> Games { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure Tournament
        modelBuilder.Entity<Tournament>()
            .HasKey(t => t.Id);

        modelBuilder.Entity<Tournament>()
            .Property(t => t.Title)
            .IsRequired()
            .HasMaxLength(100);

        modelBuilder.Entity<Tournament>()
            .Property(t => t.Description)
            .HasMaxLength(500);

        // Configure foreign key to User
        modelBuilder.Entity<Tournament>()
            .HasOne(t => t.User)
            .WithMany(u => u.Tournaments)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // Configure Game
        modelBuilder.Entity<Game>()
            .HasKey(g => g.Id);

        modelBuilder.Entity<Game>()
            .Property(g => g.Title)
            .IsRequired()
            .HasMaxLength(100);

        // Configure foreign key to Tournament
        modelBuilder.Entity<Game>()
            .HasOne(g => g.Tournament)
            .WithMany(t => t.Games)
            .HasForeignKey(g => g.TournamentId)
            .OnDelete(DeleteBehavior.Cascade);

        // Configure foreign key to User (Game creator)
        modelBuilder.Entity<Game>()
            .HasOne(g => g.User)
            .WithMany(u => u.Games)
            .HasForeignKey(g => g.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
