import React from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

export function GamesList({ games, loading, onEdit, onDelete, isOwner }) {
    if (loading) {
        return <p className="loading">Laddar spel...</p>;
    }

    if (!games || games.length === 0) {
        return <p className="loading">Inga spel hittades för denna turnering</p>;
    }

    return (
        <motion.div
            className="games-list-details"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.2,
                    },
                },
            }}
        >
            {games.map(game => (
                <motion.div
                    key={game.id}
                    className="game-card"
                    variants={{
                        hidden: { y: 20, opacity: 0 },
                        visible: { y: 0, opacity: 1 },
                    }}
                    transition={{ duration: 0.4 }}
                >
                    <h3>{game.title}</h3>
                    <div className="card-info">
                        <div>
                            <span>Tid:</span> {new Date(game.time).toLocaleString('sv-SE')}
                        </div>
                    </div>
                    {isOwner && (
                        <div className="card-actions">
                            <button className="btn btn-primary" onClick={() => onEdit(game)}>
                                Redigera
                            </button>
                            <button className="btn btn-danger" onClick={() => onDelete(game.id)}>
                                Ta bort
                            </button>
                        </div>
                    )}
                </motion.div>
            ))}
        </motion.div>
    );
}
