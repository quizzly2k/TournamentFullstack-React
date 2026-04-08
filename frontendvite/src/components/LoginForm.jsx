import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export function LoginForm() {
    const { login, register } = useContext(AuthContext);
    const [isRegistering, setIsRegistering] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(username, password);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(username, email, password, firstName, lastName);
            setError('Registreringen lyckades! Du kan nu logga in.');
            setUsername('');
            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');
            setTimeout(() => {
                setIsRegistering(false);
                setError('');
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="section-container">
            <div className="login-form">
                <h1>Tournament Manager</h1>
                <p>{isRegistering ? 'Skapa ett nytt konto' : 'Logga in för att komma igång'}</p>
                <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Användarnamn:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    {isRegistering && (
                        <>
                            <div className="form-group">
                                <label htmlFor="email">E-post:</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="firstName">Förnamn:</label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="lastName">Efternamn:</label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="form-group">
                        <label htmlFor="password">Lösenord:</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? (isRegistering ? 'Registrerar...' : 'Loggar in...') : (isRegistering ? 'Registrera' : 'Logga in')}
                    </button>

                    {error && (
                        <p className={error.includes('lyckades') ? 'success-message' : 'error-message'}>
                            {error}
                        </p>
                    )}

                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                        <p style={{ color: 'var(--gray-700)', marginBottom: '10px' }}>
                            {isRegistering ? 'Har du redan ett konto?' : 'Har du inget konto?'}
                        </p>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => {
                                setIsRegistering(!isRegistering);
                                setError('');
                            }}
                        >
                            {isRegistering ? 'Logga in istället' : 'Registrera här'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
