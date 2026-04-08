import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function Header() {
    const { user, logout, isAdmin } = useContext(AuthContext);

    return (
        <header className="header">
            <div className="header-content">
                <h1>Tournament Manager</h1>
                <div className="user-info">
                    {user && (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--secondary-color)' }}>
                                <span>{user.firstName || user.username}</span>
                                {isAdmin() && (
                                    <span style={{ 
                                        backgroundColor: '#8B4513', 
                                        padding: '2px 8px', 
                                        borderRadius: '4px', 
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                    }}>
                                        Admin
                                    </span>
                                )}
                            </div>
                            <button id="logout-btn" className="btn btn-secondary" onClick={logout}>
                                Logga ut
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
