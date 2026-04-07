import React, { useState } from 'react';
import { apiClient } from '../api/apiClient';

export function TournamentForm({ onFormClose, onTournamentAdded }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [maxPlayers, setMaxPlayers] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const tournamentDate = new Date(date);
            const now = new Date();

            if (tournamentDate <= now) {
                setError('Datum och tid måste vara i framtiden');
                setLoading(false);
                return;
            }

            const tournamentData = {
                title,
                description: description || null,
                maxPlayers: parseInt(maxPlayers),
                date: tournamentDate.toISOString()
            };

            await apiClient.createTournament(tournamentData);
            onTournamentAdded();
            onFormClose();
        } catch (err) {
            setError(`Fel: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="tournament-form-sidebar" onSubmit={handleSubmit}>
            <h3>Lägg till ny turnering</h3>
            <div className="form-group">
                <label htmlFor="tournament-title">Namn:</label>
                <input
                    type="text"
                    id="tournament-title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="tournament-description">Beskrivning:</label>
                <input
                    type="text"
                    id="tournament-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="tournament-maxplayers">Max spelare:</label>
                <input
                    type="number"
                    id="tournament-maxplayers"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(e.target.value)}
                    min="2"
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="tournament-date">Datum:</label>
                <input
                    type="datetime-local"
                    id="tournament-date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                />
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Sparar...' : 'Spara'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onFormClose}>
                    Avbryt
                </button>
            </div>
            {error && <p className="error-message">{error}</p>}
        </form>
    );
}
