import React, { useState, useEffect } from 'react';

export function ErrorBanner() {
    const [error, setError] = useState(null);

    useEffect(() => {
        const handleError = (event) => {
            const customEvent = new CustomEvent('showError');
            window.addEventListener('showError', (e) => {
                setError(e.detail);
                setTimeout(() => {
                    setError(null);
                }, 8000);
            });
        };

        window.showErrorBanner = (message) => {
            setError(message);
            setTimeout(() => {
                setError(null);
            }, 8000);
        };

        return () => {
            delete window.showErrorBanner;
        };
    }, []);

    if (!error) return null;

    return (
        <div className="error-banner">
            <div className="error-banner-content">
                <span>{error}</span>
                <button className="error-banner-close" onClick={() => setError(null)}>✕</button>
            </div>
        </div>
    );
}
