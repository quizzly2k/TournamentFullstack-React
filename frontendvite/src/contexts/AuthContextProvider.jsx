import React from 'react';
import { AuthContext } from './AuthContext';
import { apiClient } from '../api/apiClient';

export function AuthProvider({ children }) {
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        loadAuthState();
    }, []);

    const loadAuthState = () => {
        const userData = localStorage.getItem('current_user');
        if (userData && apiClient.isAuthenticated()) {
            setUser(JSON.parse(userData));
        } else {
            setUser(null);
            apiClient.removeToken();
        }
        setLoading(false);
    };

    const register = async (username, email, password, firstName, lastName) => {
        try {
            if (!username || !email || !password) {
                throw new Error('Användarnamn, e-post och lösenord är obligatoriska');
            }

            const response = await apiClient.post('/auth/register', {
                username,
                email,
                password,
                firstName: firstName || '',
                lastName: lastName || ''
            });

            if (!response.success) {
                throw new Error(response.message || 'Registreringen misslyckades');
            }

            return response;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const login = async (username, password) => {
        try {
            if (!username || !password) {
                throw new Error('Användarnamn och lösenord är obligatoriska');
            }

            const response = await apiClient.post('/auth/login', {
                username,
                password
            });

            if (!response.success) {
                throw new Error(response.message || 'Inloggningen misslyckades');
            }

            if (!response.token || !response.user) {
                throw new Error('Ogiltigt svar från servern');
            }

            apiClient.setToken(response.token);
            const userData = {
                id: response.user.id,
                username: response.user.username,
                email: response.user.email,
                firstName: response.user.firstName,
                lastName: response.user.lastName,
                roles: response.user.roles || []
            };
            setUser(userData);
            localStorage.setItem('current_user', JSON.stringify(userData));

            return userData;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const logout = () => {
        apiClient.removeToken();
        localStorage.removeItem('current_user');
        setUser(null);
    };

    const isLoggedIn = () => {
        return !!user && apiClient.isAuthenticated();
    };

    const isAdmin = () => {
        return user?.roles?.includes('Admin') || false;
    };

    const getUserDisplay = () => {
        if (user) {
            const name = user.firstName || user.username;
            return `Inloggad som: ${name}`;
        }
        return '';
    };

    return (
        <AuthContext.Provider value={{ user, loading, register, login, logout, isLoggedIn, isAdmin, getUserDisplay }}>
            {children}
        </AuthContext.Provider>
    );
}
