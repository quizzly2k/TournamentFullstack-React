/**
 * Main Application Module
 * Handles overall app initialization and tab navigation
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

/**
 * Initialize the application
 */
function initializeApp() {
    // Check authentication state on load
    checkAuthentication();

    // Setup tab navigation
    setupTabNavigation();

    // Load tournaments when app starts
    if (authManager.isLoggedIn()) {
        loadTournaments();
    }
}

/**
 * Setup tab navigation
 */
function setupTabNavigation() {
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabName = btn.dataset.tab;
            switchTab(tabName);
        });
    });
}

/**
 * Switch between tabs
 */
function switchTab(tabName) {
    // Remove active class from all tabs and buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Add active class to selected tab and button
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');

    // Load data for the selected tab
    if (tabName === 'tournaments') {
        loadTournaments();
    } else if (tabName === 'games') {
        loadTournamentsForDropdown();
    }
}

/**
 * Format date for display
 */
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Initialize app on page load
window.addEventListener('load', () => {
    // Additional setup if needed
});
