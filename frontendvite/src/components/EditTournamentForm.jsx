import React, { useState, useEffect } from 'react';
import { apiClient } from '../api/apiClient';

export function EditTournamentForm({ tournament, onFormClose, onTournamentUpdated }) {
    const [title, setTitle] = useState(tournament?.title || '');
    const [description, setDescription] = useState(tournament?.description || '');
    const [maxPlayers, setMaxPlayers] = useState(tournament?.maxPlayers || '');
    const [date, setDate] = useState(
        tournament ? new Date(tournament.date).toISOString().slice(0, 16) : ''
    );
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

            await apiClient.updateTournament(tournament.id, tournamentData);
            onTournamentUpdated();
            onFormClose();
        } catch (err) {
            setError(`Fel: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="tournament-form-inline" onSubmit={handleSubmit}>
            <h3>Redigera turnering</h3>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="tournament-title-edit">Namn:</label>
                    <input
                        type="text"
                        id="tournament-title-edit"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="tournament-description-edit">Beskrivning:</label>
                    <input
                        type="text"
                        id="tournament-description-edit"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label htmlFor="tournament-maxplayers-edit">Max spelare:</label>
                    <input
                        type="number"
                        id="tournament-maxplayers-edit"
                        value={maxPlayers}
                        onChange={(e) => setMaxPlayers(e.target.value)}
                        min="2"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="tournament-date-edit">Datum:</label>
                    <input
                        type="datetime-local"
                        id="tournament-date-edit"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
            </div>
            <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Uppdaterar...' : 'Uppdatera'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={onFormClose}>
                    Avbryt
                </button>
            </div>
            {error && <p className="error-message">{error}</p>}
        </form>
    );
}
