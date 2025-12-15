import React, { useState, useEffect } from 'react';
import { 
  Sun, 
  Wind, 
  Home, 
  CheckCircle, 
  ArrowRight, 
  Users, 
  BarChart3,
  Mail,
  Phone,
  Menu,
  X,
  ShieldCheck,
  Zap,
  Award,
  Droplets,
  Calendar,
  ExternalLink,
  Euro,
  Leaf,
  UserPlus,
  Send,
  Wallet,
  Clock,
  Smartphone,
  Share,
  Heart,
  Globe,
  ThumbsUp,
  Download,
  Wifi,
  Building2,
  Star,
  Facebook,
  Camera,
  MapPin,
  ZoomIn,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';
import { ProductType, COMMISSION_RATES } from '../types';
import LegalModal, { LegalSection } from './LegalModal';

interface LandingPageProps {
  onLogin: () => void;
}

// Helper pour simuler des dates récentes
const getRelativeDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const NEWS_ARTICLES = [
  {
    id: 1,
    category: "Réglementation",
    title: "MaPrimeRénov' : Tout savoir sur les aides de l'État en 2025",
    excerpt: "Le gouvernement ajuste les barèmes pour favoriser les rénovations d'ampleur. Découvrez les montants et les nouvelles conditions d'éligibilité.",
    date: getRelativeDate(2),
    image: "https://i.postimg.cc/Y03g8P4R/870x489-sc-primerenov.jpg",
    readTime: "4 min",
    url: "https://france-renov.gouv.fr/aides/maprimerenov"
  },
  {
    id: 2,
    category: "Étude & Performance",
    title: "Les pompes à chaleur passées au crible d'une étude inédite",
    excerpt: "Le ministère de la Transition écologique publie une analyse détaillée sur l'efficacité réelle des PAC. Découvrez les conclusions sur la performance et le confort thermique.",
    date: getRelativeDate(5),
    image: "https://i.postimg.cc/RhMGMKKX/bbbe87e87ae7-schema-fonctionnement-pompe-a-chaleur-air-air-mode-froid.jpg",
    readTime: "5 min",
    url: "https://www.notre-environnement.gouv.fr/actualites/breves/article/les-pompes-a-chaleur-passees-au-crible-d-une-etude-inedite"
  },
  {
    id: 3,
    category: "Immobilier & Loi Climat",
    title: "Loi Climat : Les propriétaires face à la lutte contre les passoires énergétiques",
    excerpt: "Interdiction de louer, audit énergétique obligatoire... Le point sur les nouvelles contraintes pesant sur les propriétaires bailleurs et les solutions de rénovation.",
    date: getRelativeDate(8),
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800",
    readTime: "6 min",
    url: "https://www.pap.fr/actualites/loi-climat-les-proprietaires-bailleurs-face-a-la-lutte-contre-les-passoires-energetiques/a22519"
  }
];

const FACEBOOK_REVIEWS = [
  {
    id: 0,
    author: "Laurent P.",
    date: "Il y a 2 jours",
    rating: 5,
    text: "Entreprise sérieuse commercial connais son sujet, travail soigné, ouvriers très professionnels, suivi des travaux, visite de fin de chantier, signature des documents... allez-y les yeux fermés 👏👏"
  },
  {
    id: 1,
    author: "Marc D.",
    date: "Il y a 1 semaine",
    rating: 5,
    text: "Bonjour l’équipe intervient en ce moment chez moi je peux vous dire que ce n’est pas une arnaque, équipe très sérieuse toujours à l’heure respectueuses et très gentil."
  },
  {
    id: 2,
    author: "Rachid B.",
    date: "Il y a 3 jours",
    rating: 5,
    text: "Au top ! J'ai recommandé l'entreprise à mon entourage, tout s'est bien passé. Le suivi sur l'application est clair et les virements sont rapides. Je valide ✅"
  }
];

const REALIZATIONS = [
  {
    id: 1,
    type: ProductType.HEAT_PUMP,
    location: "Lyon (69)",
    desc: "Pompe à Chaleur Air/Eau",
    image: "https://i.postimg.cc/mgGGbm8P/installation-pompe-a-chaleur.png"
  },
  {
    id: 2,
    type: ProductType.ISOLATION,
    location: "Bordeaux (33)",
    desc: "Isolation Extérieure",
    image: "https://i.postimg.cc/c4yzYrY3/IMG6329JPG-629c8195ee9cd.jpg"
  },
  {
    id: 3,
    type: ProductType.ISOLATION,
    location: "Lille (59)",
    desc: "Isolation Extérieure",
    image: "https://i.postimg.cc/505CR77C/480983083-945350694464238-3769839163018549847-n.jpg"
  },
  {
    id: 4,
    type: ProductType.ISOLATION,
    location: "Marseille (13)",
    desc: "Isolation Combles Rampants",
    image: "https://i.postimg.cc/h4bYLKrv/6877c9142006005b4d5a01b5-isolation-combles-amenages.jpg"
  },
  {
    id: 5,
    type: ProductType.WATER_HEATER,
    location: "Nantes (44)",
    desc: "Chauffe-Eau Solaire",
    image: "https://i.postimg.cc/ncmkJJdR/973-621a16cb02211.jpg"
  },
  {
    id: 6,
    type: ProductType.SOLAR,
    location: "Toulouse (31)",
    desc: "Panneaux Photovoltaïques",
    image: "https://i.postimg.cc/9Xn821cZ/a-KM8Oa-Tt2n-Pbab-Lv-lepretre-energies-equipements-panneaux-solaires.jpg"
  }
];

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [simulatorStep, setSimulatorStep] = useState(3);
  const [selectedProduct, setSelectedProduct] = useState<ProductType>(ProductType.SOLAR);
  const [selectedRealization, setSelectedRealization] = useState<any | null>(null);

  // Legal Modal State
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalSection, setLegalSection] = useState<LegalSection>('mentions');

  const openLegal = (section: LegalSection) => {
    setLegalSection(section);
    setIsLegalModalOpen(true);
  };

  // PWA Installation States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true) {
      setIsAppInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to install prompt: ${outcome}`);
      setDeferredPrompt(null);
    } else if (isIos) {
      alert("Pour installer sur iOS : Appuyez sur le bouton de partage puis 'Sur l'écran d'accueil'");
    } else {
      alert("Pour installer l'application, utilisez l'option 'Ajouter à l'écran d'accueil' ou 'Installer' dans le menu de votre navigateur.");
    }
  };

  const currentRate = COMMISSION_RATES.find(r => r.product === selectedProduct);
  const avgCommission = currentRate ? (currentRate.min + currentRate.max) / 2 : 0;
  const totalGain = simulatorStep * avgCommission;

  const getProductIcon = (type: ProductType) => {
    switch (type) {
      case ProductType.SOLAR: return <Sun className="w-5 h-5" />;
      case ProductType.HEAT_PUMP: return <Wind className="w-5 h-5" />;
      case ProductType.ISOLATION: return <Home className="w-5 h-5" />;
      case ProductType.WATER_HEATER: return <Droplets className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* Lightbox / Modal for Realizations */}
      {selectedRealization && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedRealization(null)}
        >
          <div className="relative w-full max-w-5xl bg-transparent" onClick={e => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedRealization(null)}
              className="absolute -top-12 right-0 text-white hover:text-sky-400 transition-colors"
            >
              <X size={32} />
            </button>
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-black">
              <img 
                src={selectedRealization.image} 
                alt={selectedRealization.desc}
                className="w-full h-auto max-h-[80vh] object-contain mx-auto"
              />
            </div>
            <div className="mt-6 text-white text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-sm font-bold uppercase tracking-wider mb-2">
                {getProductIcon(selectedRealization.type)} {selectedRealization.type}
              </div>
              <h3 className="text-2xl font-bold mb-2">{selectedRealization.desc}</h3>
              <p className="text-slate-400 flex items-center justify-center gap-2">
                <MapPin size={18} /> {selectedRealization.location}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Legal Modal Component */}
      <LegalModal 
        isOpen={isLegalModalOpen} 
        onClose={() => setIsLegalModalOpen(false)} 
        section={legalSection} 
      />

      {/* Header Container */}
      <header className="fixed w-full z-50 top-0 shadow-sm flex flex-col">
        {/* Banner - COMPACT SIZE, ROW LAYOUT */}
        <div className="bg-gradient-to-r from-sky-500 to-cyan-400 text-white py-3 md:py-5 px-4 text-center text-sm md:text-lg font-medium relative z-50">
          <div className="max-w-7xl mx-auto flex justify-center items-center gap-2 sm:gap-3">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] md:text-xs uppercase tracking-wider font-bold border border-white/30 shrink-0">Nouveau</span>
            <p className="leading-snug">
               <span className="hidden sm:inline">Boostez votre activité : </span><span className="font-bold">Prime de 500€ offerte</span> pour vos 3 premiers dossiers ! 🚀
            </p>
          </div>
        </div>

        {/* Navigation - INCREASED SIZE (h-20 md:h-24, space-x-8, text-base) */}
        <nav className="bg-white border-b border-slate-100 w-full relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 md:h-24 items-center">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-sky-500 to-cyan-400 p-1.5 md:p-2 rounded-lg">
                  <Leaf className="text-white w-6 h-6 md:w-8 md:h-8" />
                </div>
                <span className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">EcoParrain<span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-400">.</span></span>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden xl:flex items-center space-x-8 text-base font-semibold text-slate-600">
                <a href="#comment-ca-marche" className="hover:text-sky-500 transition-colors">Comment ça marche</a>
                <a href="#simulateur" className="hover:text-sky-500 transition-colors">Simulateur</a>
                <a href="#engagements" className="hover:text-sky-500 transition-colors">Engagements</a>
                <a href="#realisations" className="hover:text-sky-500 transition-colors">Réalisations</a>
                <a href="#avis" className="hover:text-sky-500 transition-colors">Avis</a>
                <a href="#actualites" className="hover:text-sky-500 transition-colors">Actualités</a>
                <button 
                  onClick={onLogin}
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                  Espace Partenaire
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="xl:hidden">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-slate-600 hover:text-slate-900"
                >
                  {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="xl:hidden bg-white border-b border-slate-100 absolute w-full left-0 shadow-lg h-[calc(100vh-80px)] overflow-y-auto">
              <div className="px-4 pt-2 pb-6 space-y-2">
                <a href="#comment-ca-marche" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg text-lg border-b border-slate-50">Comment ça marche</a>
                <a href="#simulateur" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg text-lg border-b border-slate-50">Simulateur</a>
                <a href="#engagements" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg text-lg border-b border-slate-50">Engagements</a>
                <a href="#realisations" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg text-lg border-b border-slate-50">Réalisations</a>
                <a href="#avis" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg text-lg border-b border-slate-50">Avis</a>
                <a href="#actualites" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg text-lg">Actualités</a>
                <div className="pt-8 px-2">
                  <button 
                    onClick={() => { onLogin(); setIsMobileMenuOpen(false); }}
                    className="w-full bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-5 py-5 rounded-xl font-bold text-xl hover:from-sky-600 hover:to-cyan-500 shadow-lg shadow-sky-500/20"
                  >
                    Se connecter
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-40 md:pt-56 pb-20 md:pb-24 px-4 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-sky-100/50 skew-x-12 translate-x-32 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 animate-fade-in-up text-center lg:text-left">
            
            {/* Pill Badge - WHITE BG, BLUE GRADIENT TEXT */}
            <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-2 rounded-full bg-white text-xs md:text-sm font-bold mb-0 mx-auto lg:mx-0 w-fit shadow-md border border-sky-100">
               <span className="relative flex h-2 w-2 shrink-0 md:h-2.5 md:w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-sky-500"></span>
               </span>
               <div className="whitespace-nowrap">
                  <span className="text-slate-900 uppercase tracking-wider">Nouveau :</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-400 ml-1">
                     commissions augmentées sur le solaire
                  </span>
               </div>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight">
              Système de Parrainage National - <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-500">Énergie Renouvelable</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Programme de parrainage pour prestations d'énergie renouvelable destinées aux maisons individuelles. <br/>
              <span className="font-bold text-slate-900">Un complément de revenu accessible à tous.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={onLogin}
                className="px-8 py-4 bg-gradient-to-r from-sky-500 to-cyan-400 text-white rounded-xl font-bold text-lg hover:from-sky-600 hover:to-cyan-500 transition-all shadow-xl shadow-sky-500/20 flex items-center justify-center gap-2 group"
              >
                Commencer maintenant
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => document.getElementById('simulateur')?.scrollIntoView({behavior: 'smooth'})}
                className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
              >
                Estimer mes gains
              </button>
            </div>
            
            {/* Added features list - ROW ON MOBILE */}
            <div className="mt-8 flex flex-row flex-wrap justify-center lg:justify-start gap-4 sm:gap-6 text-sm font-medium text-slate-600">
               <div className="flex items-center gap-2">
                 <CheckCircle className="text-sky-500 w-5 h-5" /> Inscription gratuite
               </div>
               <div className="flex items-center gap-2">
                 <CheckCircle className="text-sky-500 w-5 h-5" /> Paiement rapide
               </div>
               <div className="flex items-center gap-2">
                 <CheckCircle className="text-sky-500 w-5 h-5" /> Suivi temps réel
               </div>
            </div>

          </div>
          
          <div className="relative animate-fade-in lg:h-[600px] flex items-center justify-center mt-8 lg:mt-0">
             <div className="absolute inset-0 bg-gradient-to-tr from-sky-400/20 to-cyan-400/20 rounded-full blur-3xl -z-10"></div>
             <div className="relative w-full max-w-lg z-10 perspective-1000 mx-auto">
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-3xl blur opacity-20 transition duration-1000 group-hover:opacity-100"></div>
                <img 
                  src="https://i.postimg.cc/6q46KRVw/475789722-928530336146274-5051645785415902609-n.jpg" 
                  alt="Maison moderne équipée"
                  className="relative rounded-3xl shadow-2xl object-cover w-full h-auto border-4 border-white transform transition-transform hover:scale-[1.02] duration-500"
                />
             </div>
          </div>
        </div>
      </section>

      {/* How It Works Section - UPDATED TEXT */}
      <section id="comment-ca-marche" className="py-24 bg-gradient-to-r from-sky-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-3">Comment ça fonctionne</h2>
            <p className="text-lg text-sky-100">Un processus simple et transparent en 4 étapes pour générer des revenus.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/20 transition-all h-full">
                <div className="w-14 h-14 bg-white/20 text-sky-300 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <UserPlus className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Étape 1 : Inscription</h3>
                <ul className="space-y-3 text-sm text-sky-100/90">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <span>Remplir le formulaire d'adhésion en ligne</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <span>Recevoir votre kit de parrain (carte pro, codes)</span>
                  </li>
                   <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <span>Accéder à votre espace personnel</span>
                  </li>
                </ul>
            </div>

            {/* Step 2 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/20 transition-all h-full">
                <div className="w-14 h-14 bg-white/20 text-sky-300 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Étape 2 : Prospection</h3>
                <ul className="space-y-3 text-sm text-sky-100/90">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <span>Identifier des prospects (amis, voisins...)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <span>Présenter nos prestations via les supports</span>
                  </li>
                   <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <span>Collecter les coordonnées des intéressés</span>
                  </li>
                </ul>
            </div>

            {/* Step 3 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/20 transition-all h-full">
                <div className="w-14 h-14 bg-white/20 text-sky-300 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Send className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Étape 3 : Transmission</h3>
                <ul className="space-y-3 text-sm text-sky-100/90">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <span>Enregistrer le prospect dans votre espace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <span>Notre équipe prend le relais pour l'étude</span>
                  </li>
                   <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <span>Vous restez informé de l'avancement</span>
                  </li>
                </ul>
            </div>

            {/* Step 4 */}
            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/20 transition-all h-full">
                <div className="w-14 h-14 bg-white/20 text-sky-300 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <Wallet className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">Étape 4 : Commission</h3>
                <ul className="space-y-3 text-sm text-sky-100/90">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <span>Projet signé et installé = Commission</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <span>Paiement sous 30 jours après travaux</span>
                  </li>
                   <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                    <span>Suivi transparent via votre tableau de bord</span>
                  </li>
                </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator Section - UPDATED TEXT */}
      <section id="simulateur" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Simulez vos revenus potentiels</h2>
            <p className="text-lg text-slate-600">Choisissez un produit et estimez vos commissions mensuelles selon votre activité.</p>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">Type de projet</label>
                  <div className="grid grid-cols-2 gap-3">
                    {COMMISSION_RATES.map((rate) => (
                      <button
                        key={rate.product}
                        onClick={() => setSelectedProduct(rate.product)}
                        className={`p-4 rounded-xl text-left border transition-all duration-200 flex flex-col md:flex-row items-center md:items-start gap-3 text-center md:text-left ${
                          selectedProduct === rate.product
                            ? 'bg-sky-50 border-sky-500 ring-1 ring-sky-500'
                            : 'bg-white border-slate-200 hover:border-sky-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${selectedProduct === rate.product ? 'bg-sky-200 text-sky-700' : 'bg-slate-100 text-slate-500'}`}>
                          {getProductIcon(rate.product)}
                        </div>
                        <span className={`text-sm font-semibold ${selectedProduct === rate.product ? 'text-sky-900' : 'text-slate-600'}`}>
                          {rate.product}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wide">
                    Dossiers / mois : <span className="text-sky-600 text-lg">{simulatorStep}</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={simulatorStep}
                    onChange={(e) => setSimulatorStep(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sky-500 touch-pan-x"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl text-white w-full shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-sky-500/30 transition-colors"></div>
                  
                  <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Vos gains estimés</p>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-5xl font-extrabold tracking-tight">{totalGain.toLocaleString()}€</span>
                    <span className="text-slate-400 font-medium text-sm">/ mois</span>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-white/10">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-300">Commission unitaire</span>
                      <span className="font-bold">{avgCommission}€</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-300">Bonus performance</span>
                      <span className="font-bold text-emerald-400">Inclus</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-300">Annuel potentiel</span>
                      <span className="font-bold text-sky-400">{(totalGain * 12).toLocaleString()}€</span>
                    </div>
                  </div>

                  <button 
                    onClick={onLogin}
                    className="w-full mt-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-sky-50 transition-colors"
                  >
                    Démarrer l'activité
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conditions et Engagements Section - LOGOS ABOVE TITLES & BLUE CHECKS */}
      <section id="engagements" className="py-24 bg-gradient-to-r from-sky-900 to-slate-900 relative overflow-hidden text-white">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-white mb-4">Nos Engagements Mutuels</h2>
             <p className="text-lg text-sky-100">Une collaboration basée sur la confiance et le professionnalisme.</p>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Engagement du parrain */}
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/15 transition-all">
                 <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left gap-4 mb-6">
                     <div className="w-12 h-12 bg-sky-500/20 rounded-xl flex items-center justify-center shrink-0 border border-sky-400/30">
                         <Users className="text-sky-300 w-6 h-6" />
                     </div>
                     <h3 className="text-2xl font-bold text-white">Engagement du parrain</h3>
                 </div>
                 <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                       <CheckCircle className="text-sky-400 w-5 h-5 mt-1 shrink-0" />
                       <span className="text-slate-100 text-lg">Agir avec professionnalisme et éthique</span>
                    </li>
                    <li className="flex items-start gap-3">
                       <CheckCircle className="text-sky-400 w-5 h-5 mt-1 shrink-0" />
                       <span className="text-slate-100 text-lg">Transmettre des leads qualifiés (propriétaires de maisons individuelles)</span>
                    </li>
                    <li className="flex items-start gap-3">
                       <CheckCircle className="text-sky-400 w-5 h-5 mt-1 shrink-0" />
                       <span className="text-slate-100 text-lg">Ne pas démarcher pour des entreprises concurrentes</span>
                    </li>
                    <li className="flex items-start gap-3">
                       <CheckCircle className="text-sky-400 w-5 h-5 mt-1 shrink-0" />
                       <span className="text-slate-100 text-lg">Respecter la confidentialité des informations clients</span>
                    </li>
                 </ul>
              </div>

              {/* Engagement de l'entreprise */}
              <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 hover:bg-white/15 transition-all">
                 <div className="flex flex-col items-center text-center md:flex-row md:items-center md:text-left gap-4 mb-6">
                     <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center shrink-0 border border-cyan-400/30">
                         <Building2 className="text-cyan-300 w-6 h-6" />
                     </div>
                     <h3 className="text-2xl font-bold text-white">Engagement de l'entreprise</h3>
                 </div>
                 <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                       <CheckCircle className="text-cyan-400 w-5 h-5 mt-1 shrink-0" />
                       <span className="text-slate-100 text-lg">Prise de contact sous 48h avec chaque prospect transmis</span>
                    </li>
                    <li className="flex items-start gap-3">
                       <CheckCircle className="text-cyan-400 w-5 h-5 mt-1 shrink-0" />
                       <span className="text-slate-100 text-lg">Service client de qualité pour garantir la satisfaction</span>
                    </li>
                    <li className="flex items-start gap-3">
                       <CheckCircle className="text-cyan-400 w-5 h-5 mt-1 shrink-0" />
                       <span className="text-slate-100 text-lg">Paiement des commissions dans les délais convenus</span>
                    </li>
                    <li className="flex items-start gap-3">
                       <CheckCircle className="text-cyan-400 w-5 h-5 mt-1 shrink-0" />
                       <span className="text-slate-100 text-lg">Support et formation continue</span>
                    </li>
                 </ul>
              </div>
           </div>
        </div>
      </section>

      {/* Galerie des Réalisations */}
      <section id="realisations" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Nos dernières réalisations</h2>
            <p className="text-lg text-slate-600">Découvrez la qualité de nos installations partout en France.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {REALIZATIONS.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setSelectedRealization(item)}
                className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-white cursor-pointer"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.desc}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="text-white w-12 h-12 opacity-80" />
                  </div>
                </div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300 mb-2">
                         <div className="p-1 bg-sky-500/20 rounded backdrop-blur-sm border border-sky-400/30">
                            {getProductIcon(item.type)}
                         </div>
                         {item.type}
                      </div>
                      <h3 className="text-lg font-bold leading-tight mb-2">{item.desc}</h3>
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <MapPin size={14} /> {item.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
             <button className="inline-flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 hover:bg-slate-50 hover:border-sky-200 hover:text-sky-600 transition-all shadow-sm">
                <Camera size={20} />
                Voir sur Instagram
             </button>
          </div>
        </div>
      </section>

      {/* Section Avis Partenaires - ENHANCED */}
      <section id="avis" className="py-24 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-sky-100 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16 px-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 text-xs font-bold uppercase tracking-wider mb-4">
               <Facebook size={14} className="fill-blue-600" /> Facebook
             </div>
             <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-4">Ils nous recommandent sur Facebook</h2>
             <div className="flex justify-center items-center gap-4">
                <span className="text-3xl font-extrabold text-slate-900">4.9</span>
                <div className="flex flex-col items-start">
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />)}
                    </div>
                    <span className="text-slate-500 text-sm font-medium">(120+ avis)</span>
                </div>
             </div>
             <p className="text-lg text-slate-600 mt-4">La communauté des apporteurs d'affaires grandit chaque jour.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {FACEBOOK_REVIEWS.map((review, index) => (
              <div key={index} className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                 <div className="absolute top-8 right-8 text-[#1877F2] opacity-80 group-hover:opacity-100 transition-opacity">
                    <Facebook size={24} />
                 </div>
                 <div className="flex items-center gap-1 mb-6">
                    {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} size={18} className="fill-amber-400 text-amber-400" />
                    ))}
                 </div>
                 <p className="text-slate-700 italic mb-8 text-base leading-relaxed">"{review.text}"</p>
                 <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center font-bold text-slate-600 text-sm shadow-inner">
                        {review.author.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">{review.author}</p>
                        <p className="text-xs text-slate-500 font-medium">{review.date} • Vérifié</p>
                    </div>
                 </div>
              </div>
            ))}
          </div>

          <div className="text-center">
             <a 
               href="#" 
               className="inline-flex items-center gap-3 px-8 py-4 bg-[#1877F2] text-white rounded-xl font-bold hover:bg-[#166fe5] transition-colors shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 text-lg"
             >
                <Facebook className="w-6 h-6" />
                Voir les avis sur Facebook
             </a>
          </div>
        </div>
      </section>

      {/* Actualités Section - RESTORED */}
      <section id="actualites" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
             <div>
               <h2 className="text-3xl font-bold text-slate-900 mb-2">Actualités & Ressources</h2>
               <p className="text-lg text-slate-600">Restez informé des dernières évolutions du marché.</p>
             </div>
             <button className="text-sky-600 font-bold hover:text-sky-700 flex items-center gap-1 group">
               Voir tous les articles <ArrowRight className="group-hover:translate-x-1 transition-transform" />
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {NEWS_ARTICLES.map((article) => (
              <a 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                key={article.id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-slate-100"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-xs font-bold text-slate-800 rounded-full shadow-sm">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                    <Calendar size={12} /> {article.date}
                    <span>•</span>
                    <Clock size={12} /> {article.readTime}
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 mb-3 group-hover:text-sky-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-3 mb-6 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="mt-auto flex items-center text-sky-600 text-sm font-bold">
                    Lire l'article <ArrowUpRight size={16} className="ml-1" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Plateforme Digitale Section - UPDATED (Install Box Right on PC) */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Column 1: Text Content (Left) */}
            <div className="text-center lg:text-left max-w-4xl mx-auto lg:mx-0">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-600 text-xs font-bold uppercase tracking-wider mb-6">
                <Smartphone size={14} /> Application Mobile & Web
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">
                Votre activité dans votre poche.
              </h2>
              <p className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-500">Simple. Puissant. Intuitif.</p>
              
              <p className="text-slate-600 mb-8 leading-relaxed">
                Plus besoin de fichiers Excel. Notre plateforme digitale centralise tout : suivi des dossiers en temps réel, notifications automatiques, et gestion de vos commissions.
              </p>
              
              <div className="space-y-6 text-left mb-10 max-w-2xl mx-auto lg:mx-0">
                 {/* Features */}
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center shrink-0 text-sky-600"><Clock size={20}/></div>
                    <div>
                       <h4 className="font-bold text-slate-900">Suivi Temps Réel</h4>
                       <p className="text-sm text-slate-600">Soyez notifié à chaque étape : prise de RDV, signature devis, installation.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600"><Euro size={20}/></div>
                    <div>
                       <h4 className="font-bold text-slate-900">Paiements Sécurisés</h4>
                       <p className="text-sm text-slate-600">Générez vos factures de commission en un clic et suivez les virements.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0 text-purple-600"><Share size={20}/></div>
                    <div>
                       <h4 className="font-bold text-slate-900">Outils de Prospection</h4>
                       <p className="text-sm text-slate-600">Lien de parrainage personnalisé, flyers et cartes de visite numériques.</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* Column 2: Install Box (Right on Desktop, Below on Mobile) */}
            <div className="w-full flex justify-center lg:justify-end">
              <div className="bg-slate-900 rounded-2xl p-6 text-white text-left max-w-md w-full shadow-2xl">
                <div className="flex items-start justify-between mb-4">
                   <div>
                      <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">DISPONIBLE MAINTENANT</span>
                      <h3 className="text-xl font-bold mt-1">Application Web Mobile</h3>
                   </div>
                   <div className="bg-white/10 p-2 rounded-lg"><Download className="text-white"/></div>
                </div>
                <p className="text-slate-300 text-sm mb-6">Pas besoin de passer par un store. Installez directement notre application sur votre téléphone pour un accès rapide et hors ligne.</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                   <div className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle size={14} className="text-emerald-400"/> Enregistrement rapide</div>
                   <div className="flex items-center gap-2 text-sm text-slate-300"><CheckCircle size={14} className="text-emerald-400"/> Notifications suivi</div>
                </div>

                <button 
                  onClick={handleInstallClick}
                  className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-sky-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Smartphone size={18} />
                  Installer l'application
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12">
            <div className="col-span-2 md:col-span-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-6">
                 <div className="bg-gradient-to-br from-sky-500 to-cyan-400 p-2 rounded-lg">
                    <Leaf className="text-white w-6 h-6" />
                 </div>
                 <span className="text-xl font-bold text-white tracking-tight">EcoParrain<span className="text-sky-400">.</span></span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                Plateforme de référence pour les apporteurs d'affaires en énergie renouvelable. Rejoignez le réseau n°1.
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                 <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-sky-600 transition-colors"><Facebook size={18}/></a>
                 <a href="#" className="p-2 bg-slate-800 rounded-full hover:bg-sky-600 transition-colors"><Mail size={18}/></a>
              </div>
            </div>

            <div className="col-span-1">
              <h4 className="font-bold text-white mb-6 text-lg">Liens Rapides</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#comment-ca-marche" className="hover:text-sky-400 transition-colors">Comment ça marche</a></li>
                <li><a href="#simulateur" className="hover:text-sky-400 transition-colors">Simulateur</a></li>
                <li><a href="#engagements" className="hover:text-sky-400 transition-colors">Nos Engagements</a></li>
                <li><a href="#actualites" className="hover:text-sky-400 transition-colors">Actualités</a></li>
              </ul>
            </div>

            <div className="col-span-1 pl-8 md:pl-0">
              <h4 className="font-bold text-white mb-6 text-lg">Légal</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                 <li><button onClick={() => openLegal('mentions')} className="hover:text-sky-400 transition-colors text-left">Mentions Légales</button></li>
                 <li><button onClick={() => openLegal('cgu')} className="hover:text-sky-400 transition-colors text-left">CGU Partenaires</button></li>
                 <li><button onClick={() => openLegal('confidentialite')} className="hover:text-sky-400 transition-colors text-left">Confidentialité</button></li>
                 <li><button onClick={() => openLegal('cookies')} className="hover:text-sky-400 transition-colors text-left">Cookies</button></li>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 text-center md:text-left">
               <h4 className="font-bold text-white mb-6 text-lg">Contact</h4>
               <ul className="space-y-4 text-sm text-slate-400 inline-block md:block">
                 <li className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                        <Mail size={14} className="text-sky-400"/>
                    </div>
                    contact@ecoparrain.fr
                 </li>
                 <li className="flex items-center gap-3 justify-center md:justify-start">
                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0">
                        <MapPin size={14} className="text-sky-400"/>
                    </div>
                    Paris, France
                 </li>
               </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <div className="flex flex-col md:flex-row items-center gap-2 text-center md:text-left">
               <p>© 2026 EcoParrain National. Tous droits réservés.</p>
            </div>
            <div className="flex items-center gap-2 text-center">
                <Heart size={12} className="text-red-500 fill-red-500" />
                <p>Fait avec coeur pour la transition énergétique</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;