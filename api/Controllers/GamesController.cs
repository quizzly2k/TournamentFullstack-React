using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TournamentAPI.DTOs;
using TournamentAPI.Services;

namespace TournamentAPI.Controllers;

[ApiController]
[Route("api/tournaments/{tournamentId}/[controller]")]
[Authorize]
public class GamesController : ControllerBase
{
    private readonly IGameService _gameService;
    private readonly ITournamentService _tournamentService;
    private readonly RateLimitingService _rateLimitingService;
    private readonly ILogger<GamesController> _logger;

    public GamesController(
        IGameService gameService,
        ITournamentService tournamentService,
        RateLimitingService rateLimitingService,
        ILogger<GamesController> logger)
    {
        _gameService = gameService;
        _tournamentService = tournamentService;
        _rateLimitingService = rateLimitingService;
        _logger = logger;
    }

    private int GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        return int.TryParse(userIdClaim?.Value, out var userId) ? userId : 0;
    }

    private bool IsAdmin()
    {
        return User.IsInRole("Admin");
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<GameResponseDTO>>> GetGames(int tournamentId)
    {
        var tournament = await _tournamentService.GetByIdAsync(tournamentId);
        if (tournament == null)
        {
            return NotFound(new { error = "Tournament not found" });
        }

        var userId = GetUserId();
        if (!IsAdmin() && tournament.UserId != userId)
        {
            return Forbid("You do not have permission to access this tournament's games");
        }

        var games = await _gameService.GetAllAsync(tournamentId);
        return Ok(games);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<GameResponseDTO>> GetGame(int tournamentId, int id)
    {
        var tournament = await _tournamentService.GetByIdAsync(tournamentId);
        if (tournament == null)
        {
            return NotFound(new { error = "Tournament not found" });
        }

        var userId = GetUserId();
        if (!IsAdmin() && tournament.UserId != userId)
        {
            return Forbid("You do not have permission to access this tournament's games");
        }

        var game = await _gameService.GetByIdAsync(id);
        if (game == null || game.TournamentId != tournamentId)
        {
            return NotFound();
        }
        return Ok(game);
    }

    [HttpPost]
    public async Task<ActionResult<GameResponseDTO>> CreateGame(
        int tournamentId,
        [FromBody] GameCreateDTO createDTO)
    {
        var clientIp = HttpContext.Connection.RemoteIpAddress?.ToString() ?? "unknown";
        if (!_rateLimitingService.IsRequestAllowed(clientIp))
        {
            return StatusCode(429, new { error = "Too many requests" });
        }

        var tournament = await _tournamentService.GetByIdAsync(tournamentId);
        if (tournament == null)
        {
            return NotFound(new { error = "Tournament not found" });
        }

        var userId = GetUserId();
        if (!IsAdmin() && tournament.UserId != userId)
        {
            return Forbid("You do not have permission to create games in this tournament");
        }

        if (createDTO.TournamentId != tournamentId)
        {
            return BadRequest(new { error = "Tournament ID in body does not match route parameter" });
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var game = await _gameService.CreateAsync(createDTO, userId);
            return CreatedAtAction(nameof(GetGame), new { tournamentId = tournamentId, id = game.Id }, game);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<GameResponseDTO>> UpdateGame(
        int tournamentId,
        int id,
        [FromBody] GameUpdateDTO updateDTO)
    {
        var tournament = await _tournamentService.GetByIdAsync(tournamentId);
        if (tournament == null)
        {
            return NotFound(new { error = "Tournament not found" });
        }

        var userId = GetUserId();
        if (!IsAdmin() && tournament.UserId != userId)
        {
            return Forbid("You do not have permission to update games in this tournament");
        }

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var game = await _gameService.UpdateAsync(id, updateDTO);
            return Ok(game);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteGame(int tournamentId, int id)
    {
        var tournament = await _tournamentService.GetByIdAsync(tournamentId);
        if (tournament == null)
        {
            return NotFound(new { error = "Tournament not found" });
        }

        var userId = GetUserId();
        var game = await _gameService.GetByIdAsync(id);
        if (game == null)
        {
            return NotFound();
        }

        if (!IsAdmin() && game.UserId != userId && tournament.UserId != userId)
        {
            return Forbid("You do not have permission to delete this game");
        }

        var success = await _gameService.DeleteAsync(id);
        if (!success)
        {
            return NotFound();
        }
        return NoContent();
    }
}
