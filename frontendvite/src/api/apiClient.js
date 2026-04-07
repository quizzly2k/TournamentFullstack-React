const API_CONFIG = {
    BASE_URL: 'http://localhost:5050/api',
    TOKEN_KEY: 'tournament_jwt_token'
};

class ApiClient {
    constructor() {
        this.baseUrl = API_CONFIG.BASE_URL;
        this.tokenKey = API_CONFIG.TOKEN_KEY;
    }

    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }

    removeToken() {
        localStorage.removeItem(this.tokenKey);
    }

    isAuthenticated() {
        return !!this.getToken();
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

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

            if (response.status === 401) {
                this.removeToken();
                window.location.href = '/';
                throw new Error('Token expired or invalid. Please login again.');
            }

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

            if (error instanceof TypeError) {
                if (error.message.includes('Failed to fetch')) {
                    const errorMsg = `⚠️ Databasen är inte tillgänglig. Kontrollera att API-servern körs på http://localhost:5050`;
                    throw new Error(errorMsg);
                }
            }

            throw error;
        }
    }

    async get(endpoint) {
        return this.request(endpoint, {
            method: 'GET'
        });
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    }

    async getTournaments(search = '') {
        const params = search ? `?search=${encodeURIComponent(search)}` : '';
        return this.get(`/tournaments${params}`);
    }

    async getTournament(id) {
        return this.get(`/tournaments/${id}`);
    }

    async createTournament(tournamentData) {
        return this.post('/tournaments', tournamentData);
    }

    async updateTournament(id, tournamentData) {
        return this.put(`/tournaments/${id}`, tournamentData);
    }

    async deleteTournament(id) {
        return this.delete(`/tournaments/${id}`);
    }

    async getGames(tournamentId) {
        return this.get(`/tournaments/${tournamentId}/games`);
    }

    async getGame(tournamentId, gameId) {
        return this.get(`/tournaments/${tournamentId}/games/${gameId}`);
    }

    async createGame(tournamentId, gameData) {
        const dataWithTournamentId = {
            ...gameData,
            tournamentId: tournamentId
        };
        return this.post(`/tournaments/${tournamentId}/games`, dataWithTournamentId);
    }

    async updateGame(tournamentId, gameId, gameData) {
        return this.put(`/tournaments/${tournamentId}/games/${gameId}`, gameData);
    }

    async deleteGame(tournamentId, gameId) {
        return this.delete(`/tournaments/${tournamentId}/games/${gameId}`);
    }
}

export const apiClient = new ApiClient();
