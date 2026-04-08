import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { apiClient } from '../api/apiClient';
import { TournamentForm } from './TournamentForm';
import { TournamentsList } from './TournamentsList';

export function TournamentsSidebar({ selectedId, onSelectTournament, onTournamentChanged }) {
    const { isAdmin } = useContext(AuthContext);
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        loadTournaments();
    }, []);

    const loadTournaments = async () => {
        setLoading(true);
        try {
            const data = await apiClient.getTournaments();
            const tournamentsWithGameCount = await Promise.all(
                (data || []).map(async (tournament) => {
                    try {
                        const games = await apiClient.getGames(tournament.id);
                        return {
                            ...tournament,
                            gameCount: games ? games.length : 0
                        };
                    } catch (error) {
                        console.warn(`Could not load games for tournament ${tournament.id}:`, error);
                        return {
                            ...tournament,
                            gameCount: 0
                        };
                    }
                })
            );
            setTournaments(tournamentsWithGameCount);
        } catch (error) {
            console.error('Error loading tournaments:', error);
            setTournaments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleTournamentAdded = async () => {
        setShowForm(false);
        await loadTournaments();
    };

    return (
        <aside className="tournaments-sidebar">
            <div className="sidebar-header">
                <h2>Turneringar</h2>
                {isAdmin() && (
                    <button
                        className="btn btn-primary btn-small"
                        onClick={() => setShowForm(!showForm)}
                    >
                        + Ny
                    </button>
                )}
            </div>

            {showForm && (
                <TournamentForm
                    onFormClose={() => setShowForm(false)}
                    onTournamentAdded={handleTournamentAdded}
                />
            )}

            <TournamentsList
                selectedId={selectedId}
                onSelect={onSelectTournament}
                tournaments={tournaments}
                loading={loading}
            />
        </aside>
    );
}
