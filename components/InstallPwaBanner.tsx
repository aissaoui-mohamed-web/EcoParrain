
import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, X, Download, Smartphone } from 'lucide-react';

export const InstallPwaBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null); // Pour stocker l'événement d'installation Android

  useEffect(() => {
    // 1. Détection Android / Chrome (Installation Native)
    const handleBeforeInstallPrompt = (e: any) => {
      // Empêcher la mini-barre d'info automatique (on veut notre propre design)
      e.preventDefault();
      // Sauvegarder l'événement pour pouvoir le déclencher plus tard au clic
      setDeferredPrompt(e);
      // Afficher notre bannière après un petit délai
      setTimeout(() => setShowBanner(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 2. Détection iOS (Installation Manuelle)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    
    // Détection si l'app est déjà installée (mode standalone)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

    if (isIosDevice && !isStandalone) {
      setIsIos(true);
      // Délai pour ne pas agresser l'utilisateur immédiatement
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleAndroidInstall = async () => {
    if (!deferredPrompt) return;
    
    // Déclencher la pop-up native d'installation
    deferredPrompt.prompt();
    
    // Attendre la réponse de l'utilisateur
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Réponse utilisateur: ${outcome}`);
    
    // On ne peut utiliser le prompt qu'une fois
    setDeferredPrompt(null);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  // Sécurité : ne rien afficher si on n'a ni détecté iOS ni l'événement Android
  if (!isIos && !deferredPrompt) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-fade-in-up">
      <div className="max-w-md mx-auto bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl text-white overflow-hidden relative">
        <button 
          onClick={() => setShowBanner(false)}
          className="absolute top-2 right-2 p-2 text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
        
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-xl shrink-0 shadow-lg">
               <Download className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-1 text-white">Installer l'application</h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                {isIos 
                  ? "Installez EcoParrain sur votre iPhone pour un accès rapide et une meilleure expérience."
                  : "Installez l'application EcoParrain pour y accéder plus facilement et hors ligne."}
              </p>
              
              {isIos ? (
                /* VERSION iOS : Instructions manuelles */
                <div className="space-y-3 bg-slate-800/50 p-3 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-3 text-sm font-medium text-emerald-100">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 text-xs font-bold text-white">1</span>
                    <span>Appuyez sur</span>
                    <Share size={18} className="text-blue-400" />
                    <span className="text-xs text-slate-400">(Partager)</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-medium text-emerald-100">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-700 text-xs font-bold text-white">2</span>
                    <span>Sélectionnez</span>
                    <div className="flex items-center gap-1 bg-slate-700 px-2 py-0.5 rounded text-xs text-white">
                      <span>Sur l'écran d'accueil</span>
                      <PlusSquare size={14} />
                    </div>
                  </div>
                </div>
              ) : (
                /* VERSION ANDROID : Bouton d'installation native */
                <button 
                  onClick={handleAndroidInstall}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  <Smartphone className="w-5 h-5" />
                  Installer maintenant
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
