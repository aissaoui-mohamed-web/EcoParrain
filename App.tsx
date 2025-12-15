import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import { InstallPwaBanner } from './components/InstallPwaBanner';
import { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  useEffect(() => {
    // SIMULATION AUTHENTIFICATION : Vérification du LocalStorage
    const storedUser = localStorage.getItem('ecoparrain_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Erreur lecture session locale");
        localStorage.removeItem('ecoparrain_user');
      }
    }
    setLoadingInitial(false);
  }, []);

  const handleLoginSuccess = (userData: User) => {
    setShowAuthModal(false);
    setUser(userData);
    // Sauvegarde de la session
    localStorage.setItem('ecoparrain_user', JSON.stringify(userData));
  };

  const handleLogout = async () => {
    setUser(null);
    localStorage.removeItem('ecoparrain_user');
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="antialiased text-slate-800">
      {/* Bandeau d'installation automatique PWA */}
      <InstallPwaBanner />

      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : (
        <LandingPage onLogin={() => setShowAuthModal(true)} />
      )}

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;