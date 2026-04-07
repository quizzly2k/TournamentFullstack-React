import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';

export function TournamentsList({ selectedId, onSelect, tournaments, loading }) {
    if (loading) {
        return <p className="loading">Laddar turneringar...</p>;
    }

    if (!tournaments || tournaments.length === 0) {
        return <p className="loading">Inga turneringar hittades</p>;
    }

    return (
        <div className="tournaments-list-sidebar">
            {tournaments.map(tournament => {
                const gameCount = tournament.gameCount !== undefined ? tournament.gameCount : 0;
                return (
                    <div
                        key={tournament.id}
                        className={`tournament-card-sidebar ${selectedId === tournament.id ? 'active' : ''}`}
                        onClick={() => onSelect(tournament.id)}
                    >
                        <h3>{tournament.title}</h3>
                        <div className="tournament-card-sidebar-info">
                            <div>{tournament.description || 'Ingen beskrivning'}</div>
                            <div>{new Date(tournament.date).toLocaleDateString('sv-SE')}</div>
                            <div>{gameCount} spel</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
