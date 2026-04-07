import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function Header() {
    const { user, logout, getUserDisplay } = useContext(AuthContext);

    return (
        <header className="header">
            <div className="header-content">
                <h1>Tournament Manager</h1>
                <div className="user-info">
                    <span>{getUserDisplay()}</span>
                    <button id="logout-btn" className="btn btn-secondary" onClick={logout}>
                        Logga ut
                    </button>
                </div>
            </div>
        </header>
    );
}
