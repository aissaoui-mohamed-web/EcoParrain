import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, X, ArrowRight, Loader2, AlertCircle, Leaf, Eye, EyeOff, Check } from 'lucide-react';
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
  
  // Form States
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation basique
    if (view === 'REGISTER' && !acceptTerms) {
      setError("Veuillez accepter les conditions générales.");
      return;
    }

    if (formData.password.length < 4) {
        setError("Le mot de passe est trop court.");
        return;
    }

    setLoading(true);

    // SIMULATION D'APPEL RESEAU
    setTimeout(() => {
        setLoading(false);
        
        // Création d'un utilisateur fictif ou basé sur les entrées
        const role: UserRole = formData.email.includes('admin') ? 'ADMIN' : 'PARTNER';
        const fakeUser: User = {
            id: 'local-user-' + Math.random().toString(36).substr(2, 9),
            name: formData.name || (view === 'LOGIN' ? 'Partenaire Démo' : 'Nouvel Utilisateur'),
            email: formData.email,
            role: role,
            token: 'fake-jwt-token-local'
        };

        onLoginSuccess(fakeUser);
    }, 800); // Petit délai pour faire "vrai"
  };

  const switchView = (newView: AuthView) => { 
    setError(''); 
    setView(newView); 
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
        
        {/* Header Décoratif */}
        <div className="relative bg-slate-50 pt-8 pb-6 px-8 border-b border-slate-100 text-center">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 border border-slate-100 hover:border-slate-200 transition-colors z-10">
            <X size={18} />
          </button>
          
          <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-500/20 transform -rotate-6">
            <Leaf className="text-white w-8 h-8" />
          </div>
          
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {view === 'LOGIN' && 'Espace Démo'}
            {view === 'REGISTER' && 'Créer un compte'}
            {view === 'FORGOT_PASSWORD' && 'Récupération'}
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            {view === 'LOGIN' && 'Mode local activé : Connectez-vous avec n\'importe quel email.'}
            {view === 'REGISTER' && 'Rejoignez le réseau EcoParrain National.'}
            {view === 'FORGOT_PASSWORD' && 'Nous vous enverrons un lien sécurisé.'}
          </p>
        </div>

        <div className="p-8 overflow-y-auto">
          {view === 'FORGOT_PASSWORD' ? (
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center">
                <p className="text-emerald-800 mb-4">En mode démo, le mot de passe n'est pas vérifié. Vous pouvez vous reconnecter directement.</p>
                <button onClick={() => switchView('LOGIN')} className="font-bold text-emerald-700 underline">Retour connexion</button>
            </div>
          ) : (
            <div>
              {error && <div className="text-red-600 text-xs bg-red-50 p-3 rounded-xl mb-6 flex items-start gap-2 border border-red-100"><AlertCircle size={16} className="shrink-0 mt-0.5"/> {error}</div>}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {view === 'REGISTER' && (
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors">
                      <UserIcon size={20} />
                    </div>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400" 
                      placeholder="Nom complet" 
                      required 
                    />
                  </div>
                )}
                
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors">
                    <Mail size={20} />
                  </div>
                  <input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})} 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400" 
                    placeholder="Adresse email" 
                    required 
                  />
                </div>

                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-500 transition-colors">
                    <Lock size={20} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all font-medium text-slate-700 placeholder:text-slate-400" 
                    placeholder="Mot de passe" 
                    required 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Options supplémentaires */}
                <div className="flex items-center justify-between pt-1">
                  {view === 'LOGIN' ? (
                    <>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-sky-500 border-sky-500' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                          {rememberMe && <Check size={14} className="text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                        <span className="text-sm text-slate-500 group-hover:text-slate-700 select-none">Se souvenir de moi</span>
                      </label>
                      <button type="button" onClick={() => switchView('FORGOT_PASSWORD')} className="text-sm font-semibold text-sky-600 hover:text-sky-700 hover:underline">
                        Oublié ?
                      </button>
                    </>
                  ) : (
                    <label className="flex items-start gap-2 cursor-pointer group">
                        <div className={`w-5 h-5 mt-0.5 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${acceptTerms ? 'bg-sky-500 border-sky-500' : 'bg-white border-slate-300 group-hover:border-slate-400'}`}>
                          {acceptTerms && <Check size={14} className="text-white" />}
                        </div>
                        <input type="checkbox" className="hidden" checked={acceptTerms} onChange={() => setAcceptTerms(!acceptTerms)} />
                        <span className="text-xs text-slate-500 leading-snug select-none">
                          J'accepte les <span className="underline hover:text-slate-800">Conditions Générales d'Utilisation</span> et la Politique de Confidentialité.
                        </span>
                    </label>
                  )}
                </div>

                <button 
                  type="submit" 
                  disabled={loading} 
                  className={`w-full py-4 mt-4 rounded-xl font-bold text-white text-lg bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-600 hover:to-cyan-500 transition-all shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2 group`}
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-6 h-6"/>
                  ) : (
                    <>
                      {view === 'LOGIN' ? 'Connexion (Mode Local)' : "S'inscrire (Local)"}
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform opacity-80" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-8 text-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-500">
                  {view === 'LOGIN' ? "Pas encore de compte ?" : "Vous avez déjà un compte ?"}
                </p>
                <button 
                  onClick={() => switchView(view === 'LOGIN' ? 'REGISTER' : 'LOGIN')} 
                  className="font-bold text-sky-600 hover:text-sky-700 mt-1 hover:underline text-sm uppercase tracking-wide"
                >
                  {view === 'LOGIN' ? "Créer un compte partenaire" : "Se connecter"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;