/**
 * Authentication Module
 * Handles login, logout, and authentication state
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.loadAuthState();
    }

    /**
     * Load authentication state from storage
     */
    loadAuthState() {
        const user = localStorage.getItem('current_user');
        if (user && apiClient.isAuthenticated()) {
            this.currentUser = JSON.parse(user);
        } else {
            this.currentUser = null;
            apiClient.removeToken();
        }
    }

    /**
     * Login user
     * NOTE: In a real application, you would send credentials to a backend login endpoint
     * that verifies them and returns a JWT token. For now, this is a placeholder.
     */
    async login(username, password) {
        try {
            // TODO: Replace with actual API endpoint for authentication
            // For now, we'll accept any username/password and create a mock token
            // In production, send to backend: POST /api/auth/login
            
            if (!username || !password) {
                throw new Error('Användarnamn och lösenord är obligatoriska');
            }

            // Mock JWT token (in reality, this comes from the server)
            // Format: header.payload.signature
            const mockPayload = {
                sub: username,
                name: username,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + (3600 * 24) // 24 hours
            };

            // Create a mock JWT token (not valid, but good for demo)
            const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(mockPayload))}.mock_signature`;

            // Save token and user info
            apiClient.setToken(mockToken);
            this.currentUser = {
                username: username,
                loginTime: new Date().toISOString()
            };
            localStorage.setItem('current_user', JSON.stringify(this.currentUser));

            return this.currentUser;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    /**
     * Logout user
     */
    logout() {
        apiClient.removeToken();
        localStorage.removeItem('current_user');
        this.currentUser = null;
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        return this.currentUser;
    }

    /**
     * Check if user is logged in
     */
    isLoggedIn() {
        return !!this.currentUser && apiClient.isAuthenticated();
    }

    /**
     * Get username display
     */
    getUserDisplay() {
        if (this.currentUser) {
            return `Inloggad som: ${this.currentUser.username}`;
        }
        return '';
    }
}

// Create global auth manager instance
const authManager = new AuthManager();

// ============ LOGIN FORM HANDLING ============

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorElement = document.getElementById('login-error');

            try {
                errorElement.textContent = '';
                await authManager.login(username, password);
                
                // Clear form and show app
                loginForm.reset();
                showApp();
                loadInitialData();
            } catch (error) {
                errorElement.textContent = error.message || 'Inloggning misslyckades';
            }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            authManager.logout();
            hideApp();
            location.reload();
        });
    }
});

// ============ UI HELPER FUNCTIONS ============

/**
 * Show the main app section and hide login
 */
function showApp() {
    const loginSection = document.getElementById('login-section');
    const appSection = document.getElementById('app-section');
    const currentUserSpan = document.getElementById('current-user');

    if (loginSection) loginSection.classList.add('hidden');
    if (appSection) appSection.classList.remove('hidden');
    if (currentUserSpan) currentUserSpan.textContent = authManager.getUserDisplay();
}

/**
 * Hide the app section and show login
 */
function hideApp() {
    const loginSection = document.getElementById('login-section');
    const appSection = document.getElementById('app-section');

    if (loginSection) loginSection.classList.remove('hidden');
    if (appSection) appSection.classList.add('hidden');
}

/**
 * Check authentication on page load
 */
function checkAuthentication() {
    if (authManager.isLoggedIn()) {
        showApp();
        loadInitialData();
    } else {
        hideApp();
    }
}

/**
 * Load initial data when app starts
 */
async function loadInitialData() {
    // This will be called from tournaments.js and games.js
}
