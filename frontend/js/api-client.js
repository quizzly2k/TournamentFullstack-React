// API Configuration
const API_CONFIG = {
    BASE_URL: 'http://localhost:5000/api',
    TOKEN_KEY: 'tournament_jwt_token'
};

/**
 * API Client for handling all API requests
 */
class ApiClient {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
        this.tokenKey = API_CONFIG.TOKEN_KEY;
    }

    /**
     * Get the JWT token from local storage
     */
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    /**
     * Set the JWT token in local storage
     */
    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }

    /**
     * Remove the JWT token from local storage
     */
    removeToken() {
        localStorage.removeItem(this.tokenKey);
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.getToken();
    }

    /**
     * Make an API request with JWT authentication
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add JWT token to Authorization header if available
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);

            // Handle 401 Unauthorized - token might be expired
            if (response.status === 401) {
                this.removeToken();
                window.location.href = '/';
                throw new Error('Token expired or invalid. Please login again.');
            }

            // Handle 429 Too Many Requests
            if (response.status === 429) {
                throw new Error('Too many requests. Please try again later.');
            }

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(data.error || `HTTP Error: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    /**
     * GET request
     */
    async get(endpoint) {
        return this.request(endpoint, {
            method: 'GET'
        });
    }

    /**
     * POST request
     */
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    /**
     * PUT request
     */
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    /**
     * DELETE request
     */
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }

    // ============ TOURNAMENTS ============

    /**
     * Get all tournaments
     */
    async getTournaments(search = '') {
        const params = search ? `?search=${encodeURIComponent(search)}` : '';
        return this.get(`/tournaments${params}`);
    }

    /**
     * Get a single tournament
     */
    async getTournament(id) {
        return this.get(`/tournaments/${id}`);
    }

    /**
     * Create a new tournament
     */
    async createTournament(tournamentData) {
        return this.post('/tournaments', tournamentData);
    }

    /**
     * Update a tournament
     */
    async updateTournament(id, tournamentData) {
        return this.put(`/tournaments/${id}`, tournamentData);
    }

    /**
     * Delete a tournament
     */
    async deleteTournament(id) {
        return this.delete(`/tournaments/${id}`);
    }

    // ============ GAMES ============

    /**
     * Get all games for a tournament
     */
    async getGames(tournamentId) {
        return this.get(`/tournaments/${tournamentId}/games`);
    }

    /**
     * Get a single game
     */
    async getGame(tournamentId, gameId) {
        return this.get(`/tournaments/${tournamentId}/games/${gameId}`);
    }

    /**
     * Create a new game
     */
    async createGame(tournamentId, gameData) {
        const dataWithTournamentId = {
            ...gameData,
            tournamentId: tournamentId
        };
        return this.post(`/tournaments/${tournamentId}/games`, dataWithTournamentId);
    }

    /**
     * Update a game
     */
    async updateGame(tournamentId, gameId, gameData) {
        return this.put(`/tournaments/${tournamentId}/games/${gameId}`, gameData);
    }

    /**
     * Delete a game
     */
    async deleteGame(tournamentId, gameId) {
        return this.delete(`/tournaments/${tournamentId}/games/${gameId}`);
    }
}

// Create global API client instance
const apiClient = new ApiClient();
