import React, { useState } from 'react';
import { apiClient } from '../api/apiClient';

export function GameForm({ tournamentId, editingGame, onFormClose, onGameSaved }) {
    const [title, setTitle] = useState(editingGame?.title || '');
    const [time, setTime] = useState(editingGame ? new Date(editingGame.time).toISOString().slice(0, 16) : '');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const gameTime = new Date(time);
            const now = new Date();

            if (gameTime <= now) {
                setError('Datum och tid måste vara i framtiden');
                setLoading(false);
                return;
            }

            const gameData = {
                title,
                time: gameTime.toISOString(),
                tournamentId
            };

            if (editingGame) {
                await apiClient.updateGame(tournamentId, editingGame.id, gameData);
            } else {
                await apiClient.createGame(tournamentId, gameData);
            }

            onGameSaved();
            onFormClose();
        } catch (err) {
            setError(`Fel: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="game-form-inline" onSubmit={handleSubmit}>
            <h4>Lägg till nytt spel</h4>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="game-title">Spel namn:</label>
                    <input
                        type="text"
                        id="game-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="game-time">Tid:</label>
                    <input
                        type="datetime-local"
                        id="game-time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                </div>
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Sparar...' : editingGame ? 'Uppdatera spel' : 'Lägg till spel'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onFormClose}>
                    Avbryt
                </button>
            </div>
            {error && <p className="error-message">{error}</p>}
        </form>
    );
}
