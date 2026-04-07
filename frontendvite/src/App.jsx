import { useContext } from 'react';
import { AuthContext, AuthProvider } from './contexts/AuthContext';
import { LoginForm } from './components/LoginForm';
import { MainApp } from './components/MainApp';
import { ErrorBanner } from './components/ErrorBanner';
import './App.css';

function AppContent() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="section-container"><p>Laddar...</p></div>;
  }

  return (
    <>
      <ErrorBanner />
      {!user ? <LoginForm /> : <MainApp />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
