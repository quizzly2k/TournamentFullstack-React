/**
 * Games Module
 * Handles all game-related functionality
 */

let gamesData = [];
let selectedTournamentId = null;

document.addEventListener('DOMContentLoaded', () => {
    initGames();
});

/**
 * Initialize games module
 */
function initGames() {
    const gameForm = document.getElementById('game-form');

    if (gameForm) {
        gameForm.addEventListener('submit', handleGameFormSubmit);
    }
}

/**
 * Load games for a selected tournament
 */
async function loadGamesForTournament(tournamentId) {
    const gamesList = document.getElementById('games-list');
    selectedTournamentId = tournamentId;

    try {
        gamesList.innerHTML = '<p class="loading">Laddar spel...</p>';

        gamesData = await apiClient.getGames(tournamentId);

        if (!gamesData || gamesData.length === 0) {
            gamesList.innerHTML = '<p class="loading">Inga spel hittades för denna turnering</p>';
            return;
        }

        renderGames(gamesData);
    } catch (error) {
        console.error('Error loading games:', error);
        gamesList.innerHTML = `<p class="loading">Fel vid hämtning av spel: ${error.message}</p>`;
    }
}

/**
 * Render games list
 */
function renderGames(games) {
    const gamesList = document.getElementById('games-list');

    if (!games || games.length === 0) {
        gamesList.innerHTML = '<p class="loading">Inga spel hittades</p>';
        return;
    }

    gamesList.innerHTML = games.map(game => `
        <div class="game-card">
            <h3>${escapeHtml(game.title)}</h3>
            <div class="card-info">
                <div><span>Tid:</span> ${new Date(game.time).toLocaleString('sv-SE')}</div>
                <div><span>Turnering ID:</span> ${game.tournamentId}</div>
            </div>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="editGame(${game.id}, ${selectedTournamentId})">Redigera</button>
                <button class="btn btn-danger" onclick="deleteGame(${game.id}, ${selectedTournamentId})">Ta bort</button>
            </div>
        </div>
    `).join('');
}

/**
 * Handle game form submission
 */
async function handleGameFormSubmit(e) {
    e.preventDefault();

    if (!selectedTournamentId) {
        alert('Välj en turnering först');
        return;
    }

    const formData = new FormData(e.target);
    const title = formData.get('title');
    const time = formData.get('time');

    const errorElement = document.getElementById('game-form-error');

    try {
        errorElement.textContent = '';

        // Create game object
        const gameData = {
            title,
            time: new Date(time).toISOString(),
            tournamentId: selectedTournamentId
        };

        // Call API
        const response = await apiClient.createGame(selectedTournamentId, gameData);

        // Reset form and reload
        e.target.reset();
        await loadGamesForTournament(selectedTournamentId);

        console.log('Game created successfully:', response);
    } catch (error) {
        console.error('Error creating game:', error);
        errorElement.textContent = `Fel: ${error.message}`;
    }
}

/**
 * Edit game (placeholder)
 */
async function editGame(gameId, tournamentId) {
    const game = gamesData.find(g => g.id === gameId);
    if (!game) return;

    // Fill form with game data
    document.getElementById('game-title').value = game.title;
    document.getElementById('game-time').value = new Date(game.time).toISOString().slice(0, 16);

    // TODO: Implement edit functionality
    alert('Redigering av spel är ännu inte implementerad');
}

/**
 * Delete game
 */
async function deleteGame(gameId, tournamentId) {
    if (!confirm('Är du säker på att du vill ta bort detta spel?')) {
        return;
    }

    const errorElement = document.getElementById('game-form-error');

    try {
        errorElement.textContent = '';
        await apiClient.deleteGame(tournamentId, gameId);
        await loadGamesForTournament(tournamentId);
    } catch (error) {
        console.error('Error deleting game:', error);
        errorElement.textContent = `Fel vid borttagning: ${error.message}`;
    }
}

/**
 * Utility function to escape HTML
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
