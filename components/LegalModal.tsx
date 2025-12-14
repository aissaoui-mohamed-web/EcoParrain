
import React from 'react';
import { X, FileText, Shield, Cookie, Scale } from 'lucide-react';

export type LegalSection = 'mentions' | 'confidentialite' | 'cgu' | 'cookies';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: LegalSection;
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, section }) => {
  if (!isOpen) return null;

  const renderContent = () => {
    switch (section) {
      case 'mentions':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Scale className="text-emerald-600" /> Mentions Légales
            </h3>
            <div className="space-y-4 text-sm text-slate-600">
              <div>
                <h4 className="font-bold text-slate-800 mb-1">1. Éditeur du site</h4>
                <p>Le site EcoParrain National est édité par la société <strong>EcoParrain SAS</strong>.</p>
                <p>Siège social : 12 Avenue de la Transition Énergétique, 75000 Paris, France.</p>
                <p>Capital social : 10 000 €</p>
                <p>RCS Paris B 123 456 789</p>
                <p>Numéro de TVA intracommunautaire : FR 12 123456789</p>
              </div>
              
              <div>
                <h4 className="font-bold text-slate-800 mb-1">2. Directeur de la publication</h4>
                <p>Monsieur le Directeur EcoParrain</p>
                <p>Contact : contact@ecoparrain-national.fr</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">3. Hébergement</h4>
                <p>Le site est hébergé par Vercel Inc.</p>
                <p>440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">4. Propriété intellectuelle</h4>
                <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.</p>
              </div>
            </div>
          </div>
        );

      case 'confidentialite':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Shield className="text-emerald-600" /> Politique de Confidentialité
            </h3>
            <div className="space-y-4 text-sm text-slate-600">
              <p className="italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                EcoParrain accorde une importance majeure à la protection de vos données personnelles et de celles de vos prospects, conformément au RGPD.
              </p>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">1. Données collectées</h4>
                <p>Nous collectons les données suivantes :</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li><strong>Parrains :</strong> Nom, Email, RIB (pour paiement), Historique d'activité.</li>
                  <li><strong>Prospects (Filleuls) :</strong> Nom, Téléphone, Adresse, Type de projet. Ces données sont transmises par le Parrain avec le consentement oral ou écrit du Prospect.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">2. Finalité du traitement</h4>
                <p>Les données sont utilisées pour :</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>La gestion du compte Parrain et le paiement des commissions.</li>
                  <li>La prise de contact commerciale avec les Prospects pour les projets de rénovation.</li>
                  <li>L'amélioration de nos services.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">3. Conservation et Sécurité</h4>
                <p>Vos données sont conservées pour la durée de la relation contractuelle augmentée des délais légaux. Elles sont stockées sur des serveurs sécurisés en Europe.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">4. Vos Droits</h4>
                <p>Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour l'exercer, contactez : dpo@ecoparrain-national.fr.</p>
              </div>
            </div>
          </div>
        );

      case 'cgu':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="text-emerald-600" /> CGU Partenaires
            </h3>
            <div className="space-y-4 text-sm text-slate-600">
              <div>
                <h4 className="font-bold text-slate-800 mb-1">1. Objet</h4>
                <p>Les présentes Conditions Générales d'Utilisation régissent les relations entre EcoParrain et le Partenaire (Apporteur d'affaires) inscrit sur la plateforme.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">2. Rôle du Partenaire</h4>
                <p>Le Partenaire s'engage à mettre en relation des particuliers propriétaires (Prospects) intéressés par des travaux de rénovation énergétique avec EcoParrain. Le Partenaire agit de manière indépendante.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">3. Rémunération</h4>
                <p>Le Partenaire perçoit une commission forfaitaire selon le barème en vigueur uniquement si le dossier aboutit (devis signé et installation réalisée/acompte versé).</p>
                <p>Le paiement est effectué par virement bancaire sous 30 jours fin de mois après validation finale du dossier.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">4. Engagements éthiques</h4>
                <p>Le Partenaire s'interdit de :</p>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>Faire des promesses mensongères aux Prospects (ex: "panneaux gratuits").</li>
                  <li>Se faire passer pour un organisme d'État.</li>
                  <li>Harceler les prospects.</li>
                </ul>
                <p className="mt-2 text-red-500 font-medium">Tout manquement entraînera la clôture immédiate du compte sans indemnité.</p>
              </div>
            </div>
          </div>
        );

      case 'cookies':
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Cookie className="text-emerald-600" /> Gestion des Cookies
            </h3>
            <div className="space-y-4 text-sm text-slate-600">
              <div>
                <h4 className="font-bold text-slate-800 mb-1">1. Qu'est-ce qu'un cookie ?</h4>
                <p>Un cookie est un petit fichier texte déposé sur votre terminal lors de la visite du site. Il permet de conserver des données utilisateur afin de faciliter la navigation et de permettre certaines fonctionnalités.</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">2. Cookies utilisés</h4>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li><strong>Cookies fonctionnels (Obligatoires) :</strong> Nécessaires au fonctionnement de l'espace membre et à la sécurité de l'authentification.</li>
                  <li><strong>Cookies analytiques :</strong> Nous utilisons des outils anonymes pour mesurer l'audience et améliorer l'application.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">3. Gestion de vos préférences</h4>
                <p>Vous pouvez configurer votre navigateur pour refuser les cookies, cependant certaines fonctionnalités de l'Espace Partenaire pourraient ne plus fonctionner correctement.</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Information Légale</span>
          <button 
            onClick={onClose}
            className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-8 overflow-y-auto">
          {renderContent()}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors text-sm"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;
