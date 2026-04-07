import React from 'react';

export function GamesList({ games, loading, onEdit, onDelete }) {
    if (loading) {
        return <p className="loading">Laddar spel...</p>;
    }

    if (!games || games.length === 0) {
        return <p className="loading">Inga spel hittades för denna turnering</p>;
    }

    return (
        <div className="games-list-details">
            {games.map(game => (
                <div key={game.id} className="game-card">
                    <h3>{game.title}</h3>
                    <div className="card-info">
                        <div>
                            <span>Tid:</span> {new Date(game.time).toLocaleString('sv-SE')}
                        </div>
                    </div>
                    <div className="card-actions">
                        <button className="btn btn-primary" onClick={() => onEdit(game)}>
                            Redigera
                        </button>
                        <button className="btn btn-danger" onClick={() => onDelete(game.id)}>
                            Ta bort
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
