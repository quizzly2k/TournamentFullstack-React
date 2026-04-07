import React, { createContext, useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

    const login = async (username, password) => {
        try {
            if (!username || !password) {
                throw new Error('Användarnamn och lösenord är obligatoriska');
            }

            const mockPayload = {
                sub: username,
                name: username,
                iat: Math.floor(Date.now() / 1000),
                exp: Math.floor(Date.now() / 1000) + (3600 * 24)
            };

            const mockToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(JSON.stringify(mockPayload))}.mock_signature`;

            apiClient.setToken(mockToken);
            const userData = {
                username: username,
                loginTime: new Date().toISOString()
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

    const getUserDisplay = () => {
        if (user) {
            return `Inloggad som: ${user.username}`;
        }
        return '';
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, isLoggedIn, getUserDisplay }}>
            {children}
        </AuthContext.Provider>
    );
}
