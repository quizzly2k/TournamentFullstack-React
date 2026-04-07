import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { TournamentsSidebar } from './TournamentsSidebar';
import { TournamentDetails } from './TournamentDetails';
import { apiClient } from '../api/apiClient';

export function MainApp() {
    const [selectedTournamentId, setSelectedTournamentId] = useState(null);
    const [selectedTournament, setSelectedTournament] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        if (selectedTournamentId) {
            loadTournament();
        } else {
            setSelectedTournament(null);
        }
    }, [selectedTournamentId, refreshKey]);

    const loadTournament = async () => {
        try {
            const tournament = await apiClient.getTournament(selectedTournamentId);
            setSelectedTournament(tournament);
        } catch (error) {
            console.error('Error loading tournament:', error);
            setSelectedTournament(null);
        }
    };

    const handleTournamentUpdated = () => {
        setRefreshKey((prev) => prev + 1);
    };

    const handleTournamentDeleted = () => {
        setSelectedTournamentId(null);
        setSelectedTournament(null);
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <div className="section-container">
            <Header />
            <div className="app-layout">
                <TournamentsSidebar
                    key={refreshKey}
                    selectedId={selectedTournamentId}
                    onSelectTournament={setSelectedTournamentId}
                    onTournamentChanged={() => setRefreshKey((prev) => prev + 1)}
                />
                <main className="tournament-details">
                    {!selectedTournament ? (
                        <div className="no-selection">
                            <p>Välj en turnering från listan för att se och hantera spel</p>
                        </div>
                    ) : (
                        <TournamentDetails
                            key={selectedTournament.id}
                            tournament={selectedTournament}
                            onTournamentUpdated={handleTournamentUpdated}
                            onTournamentDeleted={handleTournamentDeleted}
                        />
                    )}
                </main>
            </div>
        </div>
    );
}
