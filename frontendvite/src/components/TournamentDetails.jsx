import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiClient } from '../api/apiClient';
import { GamesList } from './GamesList';
import { GameForm } from './GameForm';
import { EditTournamentForm } from './EditTournamentForm';

export function TournamentDetails({ tournament, onTournamentUpdated, onTournamentDeleted }) {
    const [games, setGames] = useState([]);
    const [gamesLoading, setGamesLoading] = useState(false);
    const [showGameForm, setShowGameForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [editingGame, setEditingGame] = useState(null);

    useEffect(() => {
        if (tournament) {
            loadGames();
        }
    }, [tournament]);

    const loadGames = async () => {
        setGamesLoading(true);
        try {
            const gamesData = await apiClient.getGames(tournament.id);
            setGames(gamesData || []);
        } catch (error) {
            console.error('Error loading games:', error);
            setGames([]);
        } finally {
            setGamesLoading(false);
        }
    };

    const handleGameSaved = async () => {
        setEditingGame(null);
        await loadGames();
    };

    const handleDeleteGame = async (gameId) => {
        if (!confirm('Är du säker på att du vill ta bort detta spel?')) {
            return;
        }

        try {
            await apiClient.deleteGame(tournament.id, gameId);
            await loadGames();
        } catch (error) {
            console.error('Error deleting game:', error);
            alert(`Fel vid borttagning: ${error.message}`);
        }
    };

    const handleDeleteTournament = async () => {
        if (!confirm('Är du säker på att du vill ta bort denna turnering?')) {
            return;
        }

        try {
            await apiClient.deleteTournament(tournament.id);
            onTournamentDeleted();
        } catch (error) {
            console.error('Error deleting tournament:', error);
            alert(`Fel vid borttagning: ${error.message}`);
        }
    };

    if (showEditForm) {
        return (
            <EditTournamentForm
                tournament={tournament}
                onFormClose={() => setShowEditForm(false)}
                onTournamentUpdated={() => {
                    setShowEditForm(false);
                    onTournamentUpdated();
                }}
            />
        );
    }

    return (
        <motion.div
            className="tournament-details-view"
            initial={{ x: -500, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 500, opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
        >
            <div className="tournament-header">
                <div className="tournament-info">
                    <h2>{tournament.title}</h2>
                    <p>{tournament.description}</p>
                </div>
                <div className="tournament-actions">
                    <button className="btn btn-primary" onClick={() => setShowEditForm(true)}>
                        Redigera
                    </button>
                    <button className="btn btn-danger" onClick={handleDeleteTournament}>
                        Ta bort
                    </button>
                </div>
            </div>

            <div className="tournament-meta">
                <div className="meta-item">
                    <span className="meta-label">Max spelare:</span>
                    <span>{tournament.maxPlayers}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-label">Datum:</span>
                    <span>{new Date(tournament.date).toLocaleDateString('sv-SE')}</span>
                </div>
                <div className="meta-item">
                    <span className="meta-label">Antal spel:</span>
                    <span>{games.length}</span>
                </div>
            </div>

            <section className="games-section">
                <div className="games-header">
                    <h3>Spel i turneringen</h3>
                    <button
                        className="btn btn-primary btn-small"
                        onClick={() => {
                            setEditingGame(null);
                            setShowGameForm(!showGameForm);
                        }}
                    >
                        + Lägg till spel
                    </button>
                </div>

                {showGameForm && (
                    <GameForm
                        tournamentId={tournament.id}
                        editingGame={editingGame}
                        onFormClose={() => {
                            setShowGameForm(false);
                            setEditingGame(null);
                        }}
                        onGameSaved={handleGameSaved}
                    />
                )}

                <GamesList
                    games={games}
                    loading={gamesLoading}
                    onEdit={(game) => {
                        setEditingGame(game);
                        setShowGameForm(true);
                    }}
                    onDelete={handleDeleteGame}
                />
            </section>
        </motion.div>
    );
}
