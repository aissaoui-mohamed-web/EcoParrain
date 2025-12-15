import React, { useState } from 'react';
import { Settings, AlertTriangle, RefreshCw } from 'lucide-react';

export const SetupGuide: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-scale-up">
        <div className="bg-slate-900 p-6 text-white flex items-center gap-4">
            <div className="p-3 bg-red-500/20 rounded-xl border border-red-500/50">
                <AlertTriangle className="text-red-400 w-8 h-8" />
            </div>
            <div>
                <h1 className="text-2xl font-bold">Configuration Requise</h1>
                <p className="text-slate-400 text-sm">L'application ne peut pas se connecter aux serveurs Google.</p>
            </div>
        </div>
        
        <div className="p-8 space-y-8">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900">
                <Settings className="shrink-0 mt-0.5 text-amber-600" />
                <p className="text-sm">
                    Le fichier <strong>services/firebase.ts</strong> contient toujours les valeurs d'exemple ("REMPLACER_PAR..."). Vous devez y mettre vos propres clés.
                </p>
            </div>

            <div className="space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sm border border-slate-200">1</span>
                    Où trouver les clés ?
                </h3>
                <div className="ml-8 space-y-2 text-sm text-slate-600">
                    <p>1. Allez sur la <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-sky-600 font-bold hover:underline">Console Firebase</a>.</p>
                    <p>2. Cliquez sur la <strong>roue dentée ⚙️</strong> (Paramètres du projet) en haut à gauche.</p>
                    <p>3. Descendez tout en bas jusqu'à la section "Vos applications".</p>
                    <p>4. Sélectionnez "Config" (pas "CDN") et copiez tout le bloc <code>firebaseConfig</code>.</p>
                </div>
            </div>

             <div className="space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-sm border border-slate-200">2</span>
                    Où les coller ?
                </h3>
                <div className="ml-8">
                    <p className="text-sm text-slate-600 mb-2">Ouvrez le fichier <code>services/firebase.ts</code> et remplacez les lignes existantes par ceci :</p>
                    <div className="bg-slate-900 rounded-xl p-4 text-xs font-mono text-slate-300 overflow-x-auto">
                        <pre>{`const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "votre-projet.firebaseapp.com",
  projectId: "votre-projet",
  storageBucket: "votre-projet.appspot.com",
  messagingSenderId: "123456...",
  appId: "1:123456..."
};`}</pre>
                    </div>
                </div>
            </div>

            <div className="pt-4 flex justify-center">
                <button onClick={() => window.location.reload()} className="flex items-center gap-2 px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-sky-600/20">
                    <RefreshCw size={20} />
                    J'ai mis à jour le fichier, recharger
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};