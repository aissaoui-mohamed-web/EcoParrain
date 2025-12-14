
import React, { useState, useEffect } from 'react';
import { Mail, Lock, User as UserIcon, X, ArrowRight, Loader2, AlertCircle, KeyRound, CheckCircle2, ArrowLeft, Shield } from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

type AuthView = 'LOGIN' | 'REGISTER' | 'FORGOT_PASSWORD';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [view, setView] = useState<AuthView>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Auto-detect admin email to toggle mode automatically
  useEffect(() => {
    if (formData.email === 'admin@ecoparrain.com') {
      setIsAdminLogin(true);
    }
  }, [formData.email]);

  if (!isOpen) return null;

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 1500));

    if (formData.email) {
      setResetSent(true);
      setLoading(false);
    } else {
      setError("Veuillez entrer votre adresse email.");
      setLoading(false);
    }
  };

  const toggleAdminMode = () => {
    setIsAdminLogin(!isAdminLogin);
    setFormData(prev => ({ ...prev, password: '' }));
  };

  // Helper to generate a stable ID from email
  const generateIdFromEmail = (email: string) => {
    // Create a stable ID like "usr_jean_dupont_gmail_com"
    return 'usr_' + email.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  };

  // Simulate JWT generation
  const generateToken = (role: string) => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({ role, exp: Date.now() + 3600000 }));
    return `${header}.${payload}.signature_securisee_${Date.now()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      if (view === 'LOGIN') {
        // Check for Admin
        if (isAdminLogin || formData.email === 'admin@ecoparrain.com') {
          if (formData.email === 'admin@ecoparrain.com' && formData.password === 'admin123') {
             const user: User = {
               id: 'adm_siege_01', 
               name: 'Siège EcoParrain', 
               email: formData.email,
               role: 'ADMIN',
               token: generateToken('ADMIN')
             };
             onLoginSuccess(user);
             return;
          } else {
             if (formData.email === 'admin@ecoparrain.com') {
                throw new Error("Mot de passe administrateur incorrect.");
             }
          }
        } 
        
        // Standard Partner Login
        if (formData.email && formData.password) {
             const userId = generateIdFromEmail(formData.email);
             // If name is not provided in login, use email part
             const displayName = formData.email.split('@')[0];
             const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1);

             const user: User = {
               id: userId,
               name: formattedName, 
               email: formData.email,
               role: 'PARTNER',
               token: generateToken('PARTNER')
             };
             onLoginSuccess(user);
        } else {
            throw new Error("Veuillez remplir tous les champs.");
        }

      } else if (view === 'REGISTER') {
        if (formData.name && formData.email && formData.password) {
          const user: User = {
            id: generateIdFromEmail(formData.email),
            name: formData.name,
            email: formData.email,
            role: 'PARTNER',
            token: generateToken('PARTNER')
          };
          onLoginSuccess(user);
        } else {
           throw new Error("Veuillez remplir tous les champs.");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setError('');
    setResetSent(false);
    setFormData(prev => ({ ...prev, password: '' }));
  };

  const switchView = (newView: AuthView) => {
    resetState();
    setView(newView);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-up border border-slate-100">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="p-8">
          
          {/* --- FORGOT PASSWORD VIEW --- */}
          {view === 'FORGOT_PASSWORD' ? (
            <div>
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound size={24} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Mot de passe oublié ?</h2>
                <p className="text-slate-500 mt-2 text-sm">
                  Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
                </p>
              </div>

              {resetSent ? (
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 text-center animate-fade-in">
                  <div className="flex justify-center mb-3">
                    <CheckCircle2 className="text-emerald-500 w-10 h-10" />
                  </div>
                  <h3 className="font-bold text-emerald-800 mb-2">Email envoyé !</h3>
                  <p className="text-sm text-emerald-700 mb-4">
                    Si un compte existe avec l'adresse <strong>{formData.email}</strong>, vous recevrez un lien dans quelques instants.
                  </p>
                  <button 
                    onClick={() => switchView('LOGIN')}
                    className="text-sm font-semibold text-emerald-600 hover:text-emerald-800 underline"
                  >
                    Retour à la connexion
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}
                  
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Email professionnel</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        placeholder={isAdminLogin ? "Ex: admin@ecoparrain.com" : "nom@exemple.com"}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Envoyer le lien'}
                  </button>

                  <button 
                    type="button"
                    onClick={() => switchView('LOGIN')}
                    className="w-full py-3 text-slate-500 hover:text-slate-800 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    <ArrowLeft size={16} /> Retour à la connexion
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* --- LOGIN / REGISTER VIEW --- */
            <div>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {view === 'LOGIN' ? 'Bon retour parmi nous !' : 'Créer votre compte'}
                </h2>
                <p className="text-slate-500 mt-2 text-sm">
                  {view === 'LOGIN' 
                    ? 'Connectez-vous pour accéder à votre espace.' 
                    : 'Rejoignez le réseau EcoParrain et commencez à gagner.'}
                </p>
              </div>

              {/* Admin Toggle Switch */}
              {view === 'LOGIN' && (
                <div className="mb-6 flex justify-center">
                  <button
                    type="button"
                    onClick={toggleAdminMode}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      isAdminLogin 
                        ? 'bg-slate-900 text-white ring-2 ring-slate-900 ring-offset-2' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    <Shield size={14} />
                    {isAdminLogin ? 'Mode Administrateur (Siège)' : 'Mode Parrain (Partenaire)'}
                  </button>
                </div>
              )}

              {error && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {view === 'REGISTER' && (
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-slate-700 ml-1">Nom complet</label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                        placeholder="Jean Dupont"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700 ml-1">Email professionnel</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder={isAdminLogin ? "Ex: admin@ecoparrain.com" : "nom@exemple.com"}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-sm font-semibold text-slate-700">Mot de passe</label>
                    {view === 'LOGIN' && (
                      <button 
                        type="button" 
                        onClick={() => switchView('FORGOT_PASSWORD')}
                        className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                      >
                        Mot de passe oublié ?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-6 disabled:opacity-70 disabled:cursor-not-allowed ${
                    isAdminLogin 
                      ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                  }`}
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5" />
                  ) : (
                    <>
                      {view === 'LOGIN' ? (isAdminLogin ? 'Accéder au Siège' : 'Se connecter') : "S'inscrire gratuitement"}
                      <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-slate-500 text-sm">
                  {view === 'LOGIN' ? "Pas encore de compte ?" : "Déjà un compte ?"}
                  <button
                    onClick={() => switchView(view === 'LOGIN' ? 'REGISTER' : 'LOGIN')}
                    className="ml-2 font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    {view === 'LOGIN' ? "Créer un compte" : "Se connecter"}
                  </button>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
