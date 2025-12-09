
import React, { useState } from 'react';
import { 
  Sun, 
  Wind, 
  Home, 
  CheckCircle, 
  ArrowRight, 
  Users, 
  PiggyBank, 
  BarChart3,
  Mail,
  Phone,
  HelpCircle,
  Menu,
  X,
  ShieldCheck,
  Zap,
  Award,
  TrendingUp,
  Droplets,
  Newspaper,
  Calendar,
  ExternalLink,
  Thermometer,
  Euro,
  Leaf,
  PlayCircle,
  BatteryCharging,
  UserPlus,
  Search,
  Send,
  Wallet,
  Clock,
  Smartphone,
  Bell
} from 'lucide-react';
import { ProductType, COMMISSION_RATES } from '../types';

interface LandingPageProps {
  onLogin: () => void;
}

// Helper pour simuler des dates récentes (pour l'effet "Actualités fraîches")
const getRelativeDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

const NEWS_ARTICLES = [
  {
    id: 1,
    category: "Réglementation",
    title: "MaPrimeRénov' 2024 : Ce qui change pour les propriétaires",
    excerpt: "Le gouvernement ajuste les barèmes pour favoriser les rénovations globales. Découvrez les nouveaux montants d'aides disponibles dès ce mois-ci.",
    date: getRelativeDate(2),
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80&w=800",
    readTime: "4 min"
  },
  {
    id: 2,
    category: "Technologie",
    title: "Panneaux Solaires : Les nouvelles cellules offrent 30% de rendement en plus",
    excerpt: "Une avancée technologique majeure permet désormais de produire plus d'électricité sur une surface de toiture réduite. Idéal pour le résidentiel.",
    date: getRelativeDate(5),
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800",
    readTime: "3 min"
  },
  {
    id: 3,
    category: "Marché",
    title: "Hausse de l'électricité : L'autoconsommation explose en France",
    excerpt: "Face à l'inflation énergétique, de plus en plus de foyers se tournent vers l'indépendance énergétique. Analyse d'une tendance durable.",
    date: getRelativeDate(8),
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&q=80&w=800",
    readTime: "5 min"
  }
];

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [simulatorStep, setSimulatorStep] = useState(3);
  const [selectedProduct, setSelectedProduct] = useState<ProductType>(ProductType.SOLAR);

  // Calculer la commission moyenne pour le produit sélectionné
  const currentRate = COMMISSION_RATES.find(r => r.product === selectedProduct);
  const avgCommission = currentRate ? (currentRate.min + currentRate.max) / 2 : 0;
  const totalGain = simulatorStep * avgCommission;

  const getProductIcon = (type: ProductType) => {
    switch (type) {
      case ProductType.SOLAR: return <Sun className="w-5 h-5" />;
      case ProductType.HEAT_PUMP: return <Wind className="w-5 h-5" />;
      case ProductType.ISOLATION: return <Home className="w-5 h-5" />;
      case ProductType.WATER_HEATER: return <Droplets className="w-5 h-5" />;
      case ProductType.EV_CHARGER: return <BatteryCharging className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header Container (Banner + Nav) */}
      <header className="fixed w-full z-50 top-0 shadow-sm flex flex-col">
        {/* Blue Banner */}
        <div className="bg-emerald-700 text-white py-2.5 px-4 text-center text-sm font-medium relative z-50">
          <div className="max-w-7xl mx-auto flex justify-center items-center gap-3">
            <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold border border-white/20">Nouveau</span>
            <p className="flex items-center gap-2">
               <span className="hidden sm:inline">Boostez votre activité : </span> 
               <span className="font-bold">Prime de 500€ offerte</span> pour vos 3 premiers dossiers ! 🚀
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="bg-white border-b border-slate-100 w-full relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <div className="flex items-center gap-2">
                <div className="bg-emerald-600 p-2 rounded-lg">
                  <Leaf className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold text-slate-900 tracking-tight">EcoParrain<span className="text-emerald-500">.</span></span>
              </div>
              
              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#solutions" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Solutions</a>
                <a href="#comment-ca-marche" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Comment ça marche</a>
                <a href="#simulateur" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Simulateur</a>
                <a href="#engagements" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Engagements</a>
                <a href="#actualites" className="text-slate-600 hover:text-emerald-600 font-medium transition-colors">Actualités</a>
                <button 
                  onClick={onLogin}
                  className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                >
                  Espace Partenaire
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 text-slate-600 hover:text-slate-900"
                >
                  {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white border-b border-slate-100 absolute w-full left-0 shadow-lg">
              <div className="px-4 pt-2 pb-6 space-y-2">
                <a href="#solutions" className="block px-3 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Solutions</a>
                <a href="#comment-ca-marche" className="block px-3 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Comment ça marche</a>
                <a href="#simulateur" className="block px-3 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Simulateur</a>
                <a href="#engagements" className="block px-3 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Engagements</a>
                <a href="#actualites" className="block px-3 py-3 text-slate-600 font-medium hover:bg-slate-50 rounded-lg">Actualités</a>
                <div className="pt-4">
                  <button 
                    onClick={onLogin}
                    className="w-full bg-emerald-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-emerald-700"
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
      <section className="pt-48 pb-20 px-4 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-50/50 skew-x-12 translate-x-32 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8 animate-fade-in-up">
            {/* Improved Info Banner */}
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-white rounded-full border border-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(16,185,129,0.25)] cursor-default">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold text-slate-700">
                Nouveau : <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Commissions augmentées sur le solaire</span>
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
              Système de Parrainage National - <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Énergie Renouvelable</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-2xl">
              Programme de parrainage pour prestations d'énergie renouvelable destinées aux maisons individuelles. <br/>
              <span className="font-bold text-slate-900">Un complément de revenu accessible à tous.</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onLogin}
                className="px-8 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 flex items-center justify-center gap-2 group"
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
            <div className="flex items-center gap-6 text-sm text-slate-500 font-medium">
              <span className="flex items-center gap-2"><CheckCircle className="text-emerald-500 w-4 h-4"/> Inscription gratuite</span>
              <span className="flex items-center gap-2"><CheckCircle className="text-emerald-500 w-4 h-4"/> Paiement rapide</span>
              <span className="flex items-center gap-2"><CheckCircle className="text-emerald-500 w-4 h-4"/> Suivi temps réel</span>
            </div>
          </div>
          
          {/* Right Column with Image */}
          <div className="relative animate-fade-in lg:h-[600px] flex items-center justify-center">
             {/* Decorative Background Blob */}
             <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 rounded-full blur-3xl -z-10"></div>
             
             {/* Image Container */}
             <div className="relative w-full max-w-lg z-10 perspective-1000">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl blur opacity-20 transition duration-1000 group-hover:opacity-100"></div>
                <img 
                  src="https://i.postimg.cc/6q46KRVw/475789722-928530336146274-5051645785415902609-n.jpg" 
                  alt="Maison moderne équipée"
                  className="relative rounded-3xl shadow-2xl object-cover w-full h-auto border-4 border-white transform transition-transform hover:scale-[1.02] duration-500"
                />

                {/* Notification Card Overlay */}
                <div className="absolute -bottom-8 -left-8 bg-white/95 backdrop-blur-sm p-6 rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-emerald-100 max-w-xs animate-scale-up z-20" style={{animationDelay: '0.5s'}}>
                   <div className="flex items-center gap-4 mb-3">
                     <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                       <Euro className="w-6 h-6" />
                     </div>
                     <div>
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Commission versée</p>
                       <p className="text-2xl font-extrabold text-slate-900">800,00 €</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <p className="text-xs text-slate-500 font-medium">Il y a 1 heure • Dossier Mme. Thomas</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="comment-ca-marche" className="py-24 bg-gradient-to-r from-emerald-800 to-teal-900 text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Comment ça fonctionne</h2>
            <p className="text-lg text-emerald-100">Un processus simple et transparent en 4 étapes pour générer des revenus.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/20 transition-all h-full flex flex-col">
                <div className="w-14 h-14 bg-white/20 text-emerald-300 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <UserPlus className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">1. Inscription au programme</h3>
                <ul className="space-y-3 text-sm text-emerald-100/90 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Remplir le formulaire d'adhésion en ligne</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Recevoir votre kit de parrain (carte, codes)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Accéder à votre espace personnel de suivi</span>
                  </li>
                </ul>
              </div>
              {/* Connector line for desktop */}
              <div className="hidden lg:block absolute top-12 right-0 translate-x-1/2 w-8 border-t-2 border-dashed border-white/20 z-20"></div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
               <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/20 transition-all h-full flex flex-col">
                <div className="w-14 h-14 bg-white/20 text-emerald-300 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">2. Prospection et recommandation</h3>
                <ul className="space-y-3 text-sm text-emerald-100/90 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Identifier des prospects (famille, amis, voisins)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Présenter nos prestations via les supports</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Collecter les coordonnées des intéressés</span>
                  </li>
                </ul>
              </div>
              <div className="hidden lg:block absolute top-12 right-0 translate-x-1/2 w-8 border-t-2 border-dashed border-white/20 z-20"></div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
               <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/20 transition-all h-full flex flex-col">
                <div className="w-14 h-14 bg-white/20 text-emerald-300 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Send className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">3. Transmission du lead</h3>
                <ul className="space-y-3 text-sm text-emerald-100/90 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Enregistrer le prospect dans votre espace</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Prise de relais par notre équipe technique</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Vous restez informé de l'avancement</span>
                  </li>
                </ul>
              </div>
              <div className="hidden lg:block absolute top-12 right-0 translate-x-1/2 w-8 border-t-2 border-dashed border-white/20 z-20"></div>
            </div>

            {/* Step 4 */}
            <div className="relative group">
               <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/20 transition-all h-full flex flex-col">
                <div className="w-14 h-14 bg-white/20 text-emerald-300 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300">
                  <Wallet className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">4. Installation et commission</h3>
                <ul className="space-y-3 text-sm text-emerald-100/90 flex-1">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Commission dès le projet signé et installé</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Paiement sous 30 jours après travaux</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    <span>Suivi transparent via votre tableau de bord</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator Section */}
      <section id="simulateur" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simulez vos revenus potentiels</h2>
            <p className="text-lg text-slate-600">Choisissez un produit et estimez vos commissions mensuelles selon votre activité.</p>
          </div>

          <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-200 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Type de projet</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {COMMISSION_RATES.map((rate) => (
                      <button
                        key={rate.product}
                        onClick={() => setSelectedProduct(rate.product)}
                        className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                          selectedProduct === rate.product
                            ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-300'
                        }`}
                      >
                        <div className={selectedProduct === rate.product ? 'text-white' : 'text-emerald-600'}>
                          {getProductIcon(rate.product)}
                        </div>
                        <span className="font-semibold text-sm">{rate.product}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-4">
                    <label className="block text-sm font-bold text-slate-900 uppercase tracking-wider">Dossiers validés par mois</label>
                    <span className="text-2xl font-bold text-emerald-600 bg-white px-4 py-1 rounded-lg border border-emerald-100 shadow-sm">{simulatorStep}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={simulatorStep}
                    onChange={(e) => setSimulatorStep(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                    <span>1 dossier</span>
                    <span>20 dossiers</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-center items-center bg-slate-50 p-8 rounded-2xl border border-slate-100 shadow-inner text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500"></div>
                <div className="p-4 bg-emerald-100 rounded-full mb-6">
                   <PiggyBank className="w-10 h-10 text-emerald-600" />
                </div>
                <p className="text-slate-500 font-medium mb-2">Vos gains estimés mensuels</p>
                <div className="text-5xl font-extrabold text-slate-900 mb-2 tracking-tight">
                  {totalGain.toLocaleString()} €
                </div>
                <p className="text-sm text-emerald-600 font-semibold bg-emerald-50 px-3 py-1 rounded-full">
                  Soit {avgCommission} € / dossier en moyenne
                </p>
                <button 
                  onClick={onLogin}
                  className="mt-8 w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                  Je commence à gagner
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section (Moved Here) */}
      <section id="solutions" className="py-20 bg-gradient-to-r from-emerald-800 to-teal-900 text-white relative overflow-hidden">
         {/* Background decoration */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
         <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
         
         <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold mb-4">Nos Solutions Phares</h2>
               <p className="text-emerald-100 text-lg max-w-2xl mx-auto">
                  Des équipements de rénovation énergétique performants et subventionnés par l'État.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/20 transition-all group cursor-default">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <Sun className="text-yellow-300 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Solaire Photovoltaïque</h3>
                  <p className="text-emerald-100/80 text-sm leading-relaxed">
                     La solution idéale pour l'autoconsommation. Réduisez les factures d'électricité de vos clients jusqu'à 70%.
                  </p>
               </div>
               
               <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/20 transition-all group cursor-default">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <Wind className="text-blue-300 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Pompe à Chaleur</h3>
                  <p className="text-emerald-100/80 text-sm leading-relaxed">
                     Remplacement de chaudières fioul ou gaz. Un confort thermique optimal et des économies immédiates.
                  </p>
               </div>

               <div className="bg-white/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl hover:bg-white/20 transition-all group cursor-default">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <Home className="text-orange-300 w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Isolation Thermique</h3>
                  <p className="text-emerald-100/80 text-sm leading-relaxed">
                     L'étape indispensable. Isolation des murs, combles et sols pour une maison saine et économe.
                  </p>
               </div>
            </div>
         </div>
      </section>

      {/* Plateforme & App Section */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Plateforme Digitale */}
            <div>
              <div className="mb-6">
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                  Outils Pro
                </span>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Plateforme digitale</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0 text-emerald-600">
                    <BarChart3 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Tableau de bord personnel</h3>
                    <p className="text-slate-600">Suivi en temps réel de vos prospects.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0 text-emerald-600">
                    <Newspaper size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Bibliothèque de ressources</h3>
                    <p className="text-slate-600">Documentations techniques, études de cas.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0 text-emerald-600">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Calculateur de commissions</h3>
                    <p className="text-slate-600">Estimez vos gains potentiels.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0 text-emerald-600">
                    <Wallet size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">Historique des paiements</h3>
                    <p className="text-slate-600">Transparence totale.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Mobile */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-600 to-teal-500 transform rotate-3 rounded-3xl opacity-10"></div>
              <div className="bg-slate-900 rounded-3xl p-8 md:p-12 relative text-white shadow-xl overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-3xl opacity-20 translate-x-1/2 -translate-y-1/2"></div>
                
                <h2 className="text-3xl font-bold mb-8 relative z-10">Application mobile</h2>
                
                <ul className="space-y-6 relative z-10">
                  <li className="flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <UserPlus className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="font-medium text-lg">Enregistrement rapide des prospects</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Bell className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="font-medium text-lg">Notifications sur l'avancement des dossiers</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <Newspaper className="w-6 h-6 text-emerald-400" />
                    </div>
                    <span className="font-medium text-lg">Accès aux supports marketing</span>
                  </li>
                </ul>

                <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row gap-4 relative z-10">
                  <button className="flex-1 bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                    <Smartphone className="w-5 h-5" />
                    iOS & Android
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conditions & Engagement Section */}
      <section id="engagements" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Nos Engagements Mutuels</h2>
            <p className="text-lg text-slate-600">Une relation de confiance basée sur des engagements clairs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Engagement du parrain */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <UserPlus className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Engagement du parrain</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600">Agir avec professionnalisme et éthique</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600">Transmettre des leads qualifiés (propriétaires de maisons individuelles)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600">Ne pas démarcher pour des entreprises concurrentes</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600">Respecter la confidentialité des informations clients</span>
                </li>
              </ul>
            </div>

            {/* Engagement de l'entreprise */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <ShieldCheck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Engagement de l'entreprise</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600">Prise de contact sous 48h avec chaque prospect transmis</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600">Service client de qualité pour garantir la satisfaction</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600">Paiement des commissions dans les délais convenus</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <span className="text-slate-600">Support et formation continue</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Actualités Section */}
      <section id="actualites" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">L'actualité de l'énergie</h2>
            <p className="text-lg text-slate-600">Restez informé des dernières évolutions du marché et de la réglementation.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {NEWS_ARTICLES.map((article) => (
              <div key={article.id} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-video">
                  <img 
                    src={article.image} 
                    alt={article.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                    {article.category}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1"><Calendar size={14}/> {article.date}</span>
                    <span className="flex items-center gap-1"><Clock size={14}/> {article.readTime}</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                  <button className="text-emerald-600 font-bold text-sm flex items-center gap-1 mt-2 group-hover:gap-2 transition-all">
                    Lire l'article <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-emerald-600 p-2 rounded-lg">
                  <Leaf className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">EcoParrain<span className="text-emerald-500">.</span></span>
              </div>
              <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
                La première plateforme nationale mettant en relation apporteurs d'affaires et experts en rénovation énergétique. Ensemble, accélérons la transition.
              </p>
              <div className="flex gap-4">
                {/* Social Icons Placeholder */}
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg>
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.48 2h.165zM12 7a5 5 0 100 10 5 5 0 000-10zm0 1.833a3.167 3.167 0 110 6.334 3.167 3.167 0 010-6.334zM16.333 7.667a.917.917 0 100-1.834.917.917 0 000 1.834z" clipRule="evenodd" /></svg>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-bold mb-6">Liens Rapides</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#solutions" className="hover:text-emerald-500 transition-colors">Solutions</a></li>
                <li><a href="#comment-ca-marche" className="hover:text-emerald-500 transition-colors">Comment ça marche</a></li>
                <li><a href="#simulateur" className="hover:text-emerald-500 transition-colors">Simulateur</a></li>
                <li><a href="#engagements" className="hover:text-emerald-500 transition-colors">Engagements</a></li>
                <li><a href="#actualites" className="hover:text-emerald-500 transition-colors">Actualités</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Légal</h4>
              <ul className="space-y-4 text-sm">
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">CGU Partenaires</a></li>
                <li><a href="#" className="hover:text-emerald-500 transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2024 EcoParrain National. Tous droits réservés.</p>
            <p className="mt-4 md:mt-0 flex items-center gap-2">
              Fait avec <span className="text-red-500">❤</span> pour la transition énergétique
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
