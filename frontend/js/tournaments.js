/**
 * Tournaments Module
 * Handles all tournament-related functionality
 */

let tournamentsData = [];

document.addEventListener('DOMContentLoaded', () => {
    initTournaments();
});

/**
 * Initialize tournaments module
 */
function initTournaments() {
    const tournamentForm = document.getElementById('tournament-form');
    const gamesForm = document.getElementById('game-form');

    if (tournamentForm) {
        tournamentForm.addEventListener('submit', handleTournamentFormSubmit);
    }

    // Load tournaments when tab is clicked
    const tournamentTabBtn = document.querySelector('[data-tab="tournaments"]');
    if (tournamentTabBtn) {
        tournamentTabBtn.addEventListener('click', loadTournaments);
    }

    // Populate tournament dropdown for games tab
    const gamesTournamentSelect = document.getElementById('game-tournament-select');
    if (gamesTournamentSelect) {
        gamesTournamentSelect.addEventListener('change', handleTournamentSelect);
        loadTournamentsForDropdown();
    }
}

/**
 * Load tournaments from API
 */
async function loadTournaments() {
    const tournamentsList = document.getElementById('tournaments-list');

    try {
        tournamentsList.innerHTML = '<p class="loading">Laddar turneringar...</p>';
        
        tournamentsData = await apiClient.getTournaments();

        if (!tournamentsData || tournamentsData.length === 0) {
            tournamentsList.innerHTML = '<p class="loading">Inga turneringar hittades</p>';
            return;
        }

        renderTournaments(tournamentsData);
    } catch (error) {
        console.error('Error loading tournaments:', error);
        tournamentsList.innerHTML = `<p class="loading">Fel vid hämtning av turneringar: ${error.message}</p>`;
    }
}

/**
 * Load tournaments for the dropdown (games tab)
 */
async function loadTournamentsForDropdown() {
    const select = document.getElementById('game-tournament-select');

    try {
        const tournaments = await apiClient.getTournaments();
        tournamentsData = tournaments;

        // Clear existing options except the default one
        while (select.options.length > 1) {
            select.remove(1);
        }

        // Add tournaments to dropdown
        tournaments.forEach(tournament => {
            const option = document.createElement('option');
            option.value = tournament.id;
            option.textContent = `${tournament.title} (${new Date(tournament.date).toLocaleDateString('sv-SE')})`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading tournaments for dropdown:', error);
    }
}

/**
 * Render tournaments list
 */
function renderTournaments(tournaments) {
    const tournamentsList = document.getElementById('tournaments-list');

    if (!tournaments || tournaments.length === 0) {
        tournamentsList.innerHTML = '<p class="loading">Inga turneringar hittades</p>';
        return;
    }

    tournamentsList.innerHTML = tournaments.map(tournament => `
        <div class="tournament-card">
            <h3>${escapeHtml(tournament.title)}</h3>
            <div class="card-info">
                <div><span>Beskrivning:</span> ${escapeHtml(tournament.description || 'N/A')}</div>
                <div><span>Max spelare:</span> ${tournament.maxPlayers}</div>
                <div><span>Datum:</span> ${new Date(tournament.date).toLocaleDateString('sv-SE')}</div>
                <div><span>Spel:</span> ${tournament.games?.length || 0}</div>
            </div>
            <div class="card-actions">
                <button class="btn btn-primary" onclick="editTournament(${tournament.id})">Redigera</button>
                <button class="btn btn-danger" onclick="deleteTournament(${tournament.id})">Ta bort</button>
            </div>
        </div>
    `).join('');
}

/**
 * Handle tournament form submission
 */
async function handleTournamentFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const title = formData.get('title');
    const description = formData.get('description');
    const maxPlayers = parseInt(formData.get('maxPlayers'));
    const date = formData.get('date');

    const errorElement = document.getElementById('tournament-form-error');

    try {
        errorElement.textContent = '';

        // Create tournament object
        const tournamentData = {
            title,
            description: description || null,
            maxPlayers,
            date: new Date(date).toISOString()
        };

        // Call API
        const response = await apiClient.createTournament(tournamentData);

        // Reset form and reload
        e.target.reset();
        await loadTournaments();
        await loadTournamentsForDropdown();

        // Show success (optional)
        console.log('Tournament created successfully:', response);
    } catch (error) {
        console.error('Error creating tournament:', error);
        errorElement.textContent = `Fel: ${error.message}`;
    }
}

/**
 * Edit tournament (placeholder)
 */
async function editTournament(id) {
    const tournament = tournamentsData.find(t => t.id === id);
    if (!tournament) return;

    // Fill form with tournament data
    document.getElementById('tournament-title').value = tournament.title;
    document.getElementById('tournament-description').value = tournament.description || '';
    document.getElementById('tournament-maxplayers').value = tournament.maxPlayers;
    document.getElementById('tournament-date').value = new Date(tournament.date).toISOString().slice(0, 16);

    // TODO: Implement edit functionality
    alert('Redigering av turneringar är ännu inte implementerad');
}

/**
 * Delete tournament
 */
async function deleteTournament(id) {
    if (!confirm('Är du säker på att du vill ta bort denna turnering?')) {
        return;
    }

    const errorElement = document.getElementById('tournament-form-error');

    try {
        errorElement.textContent = '';
        await apiClient.deleteTournament(id);
        await loadTournaments();
        await loadTournamentsForDropdown();
    } catch (error) {
        console.error('Error deleting tournament:', error);
        errorElement.textContent = `Fel vid borttagning: ${error.message}`;
    }
}

/**
 * Handle tournament selection in games tab
 */
async function handleTournamentSelect(e) {
    const tournamentId = e.target.value;
    const gameForm = document.getElementById('game-form');

    if (!tournamentId) {
        gameForm.classList.add('hidden');
        document.getElementById('games-list').innerHTML = '<p class="loading">Välj en turnering för att se spel</p>';
        return;
    }

    gameForm.classList.remove('hidden');
    await loadGamesForTournament(tournamentId);
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
