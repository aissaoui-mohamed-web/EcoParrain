import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Bell, 
  Search,
  Menu,
  X,
  TrendingUp,
  Wallet,
  CheckCircle,
  Clock,
  ChevronRight,
  Plus,
  User as UserIcon,
  Phone,
  Mail,
  Calendar,
  Zap,
  Home,
  Wind,
  Droplets,
  Check,
  Edit2,
  Trash2,
  ArrowUpRight,
  MessageSquare,
  Briefcase,
  ChevronLeft,
  ChevronDown
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell, 
  Legend,
  BarChart,
  Bar,
  LabelList
} from 'recharts';
import { User, Lead, LeadStatus, ProductType, COMMISSION_RATES } from '../types';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

// Données statiques
const evolutionData = [
  { name: 'Jan', value: 400 },
  { name: 'Fév', value: 1200 },
  { name: 'Mar', value: 2400 },
  { name: 'Avr', value: 3800 },
  { name: 'Mai', value: 5200 },
  { name: 'Juin', value: 7800 },
];

const productData = [
  { name: 'Solaire', value: 12, color: '#0ea5e9' },
  { name: 'PAC', value: 8, color: '#10b981' },
  { name: 'Isolation', value: 5, color: '#f59e0b' },
  { name: 'Chauffe-eau', value: 3, color: '#6366f1' },
];

const MOCK_NOTIFICATIONS = [
  { id: 1, title: "Dossier validé", message: "Le dossier de Jean Dupont a été validé.", time: "2 min", type: "success" },
  { id: 2, title: "Nouvelle prime", message: "Commission solaire augmentée !", time: "1h", type: "info" },
  { id: 3, title: "Rappel", message: "Pensez à relancer le prospect M. Martin.", time: "Hier", type: "warning" },
];

const MOCK_PARTNERS = [
  { id: 'p1', name: 'Partner Demo', email: 'partner@demo.com', totalLeads: 12, totalCommission: 4500 },
  { id: 'p2', name: 'Thomas R.', email: 'thomas.r@immo.fr', totalLeads: 5, totalCommission: 1200 },
  { id: 'p3', name: 'Sarah L.', email: 'sarah.l@courtier.fr', totalLeads: 8, totalCommission: 3100 },
];

// Données initiales avec IDs partenaires variés pour la démo
const INITIAL_LEADS: Lead[] = [
  {
    id: '1',
    partnerId: 'p1',
    partnerName: 'Partner Demo',
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '06 12 34 56 78',
    products: [ProductType.SOLAR],
    status: LeadStatus.MEETING,
    dateAdded: '2023-06-15',
    estimatedCommission: 850
  },
  {
    id: '2',
    partnerId: 'p1',
    partnerName: 'Partner Demo',
    name: 'Marie Martin',
    email: 'marie.martin@email.com',
    phone: '06 98 76 54 32',
    products: [ProductType.HEAT_PUMP, ProductType.ISOLATION],
    status: LeadStatus.SIGNED,
    dateAdded: '2023-06-18',
    estimatedCommission: 1050
  },
  {
    id: '3',
    partnerId: 'p2',
    partnerName: 'Thomas R.',
    name: 'Paul Durand',
    email: 'paul.durand@email.com',
    phone: '06 11 22 33 44',
    products: [ProductType.ISOLATION],
    status: LeadStatus.NEW,
    dateAdded: '2023-06-20',
    estimatedCommission: 500
  },
  {
    id: '4',
    partnerId: 'p3',
    partnerName: 'Sarah L.',
    name: 'Lucas Bernard',
    email: 'lucas.b@email.com',
    phone: '07 89 56 23 12',
    products: [ProductType.SOLAR],
    status: LeadStatus.INSTALLED,
    dateAdded: '2023-06-21',
    estimatedCommission: 900
  }
];

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  
  // Modals & Panels State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Admin State
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);

  // Formulaire d'ajout
  const [newLeadForm, setNewLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    products: [] as ProductType[]
  });

  // --- LOGIC ---

  const currentTotalCommission = newLeadForm.products.reduce((acc, product) => {
    const rate = COMMISSION_RATES.find(r => r.product === product);
    const avg = rate ? (rate.min + rate.max) / 2 : 0;
    return acc + avg;
  }, 0);

  const toggleProduct = (product: ProductType) => {
    setNewLeadForm(prev => {
      const exists = prev.products.includes(product);
      if (exists) return { ...prev, products: prev.products.filter(p => p !== product) };
      return { ...prev, products: [...prev.products, product] };
    });
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (newLeadForm.products.length === 0) {
      alert("Veuillez sélectionner au moins un produit.");
      return;
    }
    const newLead: Lead = {
      id: Date.now().toString(),
      partnerId: user.id,
      partnerName: user.name,
      name: newLeadForm.name,
      phone: newLeadForm.phone,
      email: newLeadForm.email,
      products: newLeadForm.products,
      status: LeadStatus.NEW,
      dateAdded: new Date().toISOString(),
      estimatedCommission: currentTotalCommission
    };
    setLeads([newLead, ...leads]);
    setIsAddModalOpen(false);
    setNewLeadForm({ name: '', phone: '', email: '', products: [] });
    setActiveTab('leads');
  };

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    const updatedLeads = leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l);
    setLeads(updatedLeads);
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };
  
  const handleDeleteLead = (leadId: string) => {
      if(confirm("Êtes-vous sûr de vouloir supprimer ce dossier ?")) {
          setLeads(leads.filter(l => l.id !== leadId));
          setSelectedLead(null);
      }
  };

  const getProductIcon = (type: ProductType) => {
    switch (type) {
      case ProductType.SOLAR: return <Zap className="w-5 h-5" />;
      case ProductType.HEAT_PUMP: return <Wind className="w-5 h-5" />;
      case ProductType.ISOLATION: return <Home className="w-5 h-5" />;
      case ProductType.WATER_HEATER: return <Droplets className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: LeadStatus) => {
      switch(status) {
          case LeadStatus.NEW: return 'bg-blue-100 text-blue-700 border-blue-200';
          case LeadStatus.SIGNED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
          case LeadStatus.INSTALLED: return 'bg-purple-100 text-purple-700 border-purple-200';
          case LeadStatus.PAID: return 'bg-green-100 text-green-800 border-green-200';
          default: return 'bg-amber-100 text-amber-700 border-amber-200';
      }
  };

  const displayedLeads = user.role === 'ADMIN' 
    ? leads // Admin voit tout le monde
    : leads.filter(l => l.partnerId === user.id); // Partenaire ne voit que lui

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      
      {/* Sidebar - Desktop ONLY - REFINED & CLEANER */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white fixed h-full z-10 transition-all duration-300 shadow-xl">
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800">
          <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-white">E</div>
          <span className="font-bold text-lg tracking-tight">EcoParrain<span className="text-sky-400">.</span></span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${activeTab === 'dashboard' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <LayoutDashboard size={18} /> Tableau de bord
          </button>
          
          <button onClick={() => setActiveTab('leads')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${activeTab === 'leads' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <FileText size={18} /> Dossiers
          </button>

          {user.role === 'ADMIN' && (
            <button onClick={() => setActiveTab('partners')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${activeTab === 'partners' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
                <Briefcase size={18} /> Partenaires
            </button>
          )}

          <button onClick={() => setActiveTab('commissions')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${activeTab === 'commissions' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <Wallet size={18} /> Gains
          </button>
          <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium ${activeTab === 'settings' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}>
            <UserIcon size={18} /> Profil
          </button>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium">
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col pb-24 lg:pb-0">
        
        {/* Header Desktop - STANDARDIZED & SLIMMER (h-16) */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-20 h-16 shadow-sm">
           <div className="px-4 sm:px-6 h-full flex items-center justify-between">
              
              {/* Mobile Logo */}
              <div className="flex items-center gap-2 lg:hidden">
                 <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-400 rounded-lg flex items-center justify-center font-bold text-white">E</div>
                 <span className="font-bold text-lg text-slate-900 tracking-tight">EcoParrain</span>
              </div>

              {/* Desktop Title & Search */}
              <div className="hidden lg:flex items-center flex-1 gap-8">
                 <h1 className="text-lg font-bold text-slate-900">
                    {activeTab === 'dashboard' && "Vue d'ensemble"}
                    {activeTab === 'leads' && "Dossiers"}
                    {activeTab === 'partners' && "Partenaires"}
                    {activeTab === 'commissions' && "Gains"}
                    {activeTab === 'settings' && "Profil"}
                 </h1>
                 
                 <div className="relative max-w-md w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Rechercher un dossier, un client..." 
                      className="pl-9 pr-4 py-1.5 w-full bg-slate-100 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all" 
                    />
                 </div>
              </div>

              {/* Right Side Actions - STANDARD DASHBOARD LAYOUT */}
              <div className="flex items-center gap-3 md:gap-4">
                 {user.role === 'ADMIN' && (
                    <div className="hidden md:flex items-center px-2 py-0.5 bg-amber-50 text-amber-700 rounded-md text-[10px] font-bold border border-amber-200 uppercase tracking-wide">
                        Admin
                    </div>
                 )}
                 
                 <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                 >
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                 </button>

                 {/* User Profile Dropdown (Desktop) */}
                 <div className="hidden lg:flex items-center gap-3 pl-3 border-l border-slate-200 cursor-pointer hover:bg-slate-50 p-1 rounded-lg transition-colors" onClick={() => setActiveTab('settings')}>
                    <div className="text-right hidden xl:block">
                        <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
                        <p className="text-xs text-slate-500 mt-1 capitalize">{user.role.toLowerCase()}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-emerald-400 flex items-center justify-center text-xs font-bold text-white shadow-sm ring-2 ring-white">
                        {user.name.charAt(0)}
                    </div>
                    <ChevronDown size={14} className="text-slate-400" />
                 </div>
              </div>
           </div>

            {/* Notification Dropdown */}
            {showNotifications && (
                <div className="absolute top-full right-0 lg:right-4 w-full md:w-80 bg-white shadow-2xl border border-slate-100 animate-fade-in z-50 rounded-b-2xl md:rounded-2xl overflow-hidden mt-1">
                    <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                        <button onClick={() => setShowNotifications(false)}><X size={16} className="text-slate-400"/></button>
                    </div>
                    <div className="max-h-[60vh] overflow-y-auto">
                        {MOCK_NOTIFICATIONS.map(n => (
                            <div key={n.id} className="p-3 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
                                <div className="flex gap-3">
                                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.type === 'success' ? 'bg-emerald-500' : n.type === 'info' ? 'bg-sky-500' : 'bg-amber-500'}`}></div>
                                    <div>
                                        <p className="font-bold text-xs text-slate-900">{n.title}</p>
                                        <p className="text-xs text-slate-600 leading-snug">{n.message}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 text-center bg-slate-50 text-xs font-bold text-sky-600 cursor-pointer hover:bg-slate-100 transition-colors">
                        Marquer tout comme lu
                    </div>
                </div>
            )}
        </header>

        {/* Content Body */}
        <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
            
            {/* VUE: DASHBOARD */}
            {activeTab === 'dashboard' && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                   <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                         <div className="p-2 bg-sky-50 rounded-lg text-sky-600"><FileText size={20} /></div>
                         <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">+1</span>
                      </div>
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Dossiers</p>
                      <p className="text-2xl font-bold text-slate-900">{displayedLeads.length}</p>
                   </div>

                   <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                         <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><CheckCircle size={20} /></div>
                      </div>
                      <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">Signés</p>
                      <p className="text-2xl font-bold text-slate-900">
                         {displayedLeads.filter(l => l.status === LeadStatus.SIGNED || l.status === LeadStatus.INSTALLED).length}
                      </p>
                   </div>

                   <div className="col-span-2 bg-gradient-to-r from-sky-600 to-cyan-500 p-6 rounded-xl shadow-lg text-white relative overflow-hidden group">
                      <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-10 -translate-y-10 group-hover:bg-white/20 transition-all"></div>
                      <p className="text-sky-100 text-sm font-medium mb-1 relative z-10">Total Commissions (Est.)</p>
                      <p className="text-3xl font-bold mb-4 relative z-10">
                        {displayedLeads.reduce((acc, l) => acc + l.estimatedCommission, 0).toLocaleString()} €
                      </p>
                      <button 
                        onClick={() => setActiveTab('commissions')}
                        className="relative z-10 py-2 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
                      >
                         <Clock size={16} /> Voir l'historique
                      </button>
                   </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                   <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
                      <h3 className="font-bold text-base text-slate-900">Derniers Dossiers</h3>
                      <button onClick={() => setActiveTab('leads')} className="text-sky-600 text-sm font-medium hover:text-sky-700 flex items-center gap-1">
                         Tout voir <ChevronRight size={16} />
                      </button>
                   </div>
                   
                   <div className="divide-y divide-slate-50">
                      {displayedLeads.slice(0, 3).map((lead) => (
                        <div key={lead.id} onClick={() => setSelectedLead(lead)} className="px-6 py-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between">
                           <div className="flex items-center gap-4">
                              <div className={`w-2 h-2 rounded-full ${lead.status === LeadStatus.SIGNED ? 'bg-emerald-500' : 'bg-sky-500'}`}></div>
                              <div>
                                 <p className="font-bold text-slate-900 text-sm">{lead.name}</p>
                                 <div className="flex gap-2 text-xs text-slate-500">
                                    <span>{lead.products.join(' + ')}</span>
                                    {user.role === 'ADMIN' && <span className="text-sky-600">• {lead.partnerName}</span>}
                                 </div>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-6">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(lead.status)}`}>
                                {lead.status}
                              </span>
                              <span className="font-bold text-sky-600 text-sm w-16 text-right">{lead.estimatedCommission}€</span>
                              <ChevronRight size={16} className="text-slate-300" />
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
              </>
            )}

            {/* VUE: DOSSIERS (Leads) */}
            {activeTab === 'leads' && (
               <div className="space-y-4 pb-20">
                  <div className="flex justify-between items-center mb-2">
                     <h2 className="text-lg font-bold">Tous mes dossiers ({displayedLeads.length})</h2>
                     <button onClick={() => setIsAddModalOpen(true)} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-sm transition-all">
                        <Plus size={16}/> Nouveau Dossier
                     </button>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                     {displayedLeads.map((lead) => (
                        <div key={lead.id} onClick={() => setSelectedLead(lead)} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden hover:shadow-md transition-all cursor-pointer group">
                           <div className={`absolute top-0 left-0 w-1 h-full transition-all group-hover:w-1.5 ${lead.status === LeadStatus.SIGNED ? 'bg-emerald-500' : 'bg-sky-500'}`}></div>
                           <div className="flex justify-between items-start mb-3 pl-2">
                              <div>
                                 <h3 className="font-bold text-slate-900 text-lg">{lead.name}</h3>
                                 {user.role === 'ADMIN' && (
                                    <p className="text-xs text-sky-600 font-bold mb-1">{lead.partnerName}</p>
                                 )}
                                 <p className="text-slate-500 text-sm">{lead.phone}</p>
                              </div>
                              <div className="text-right">
                                 <p className="font-bold text-slate-900">{lead.estimatedCommission}€</p>
                              </div>
                           </div>
                           <div className="pl-2 pt-3 border-t border-slate-50 flex justify-between items-center">
                              <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${getStatusColor(lead.status)}`}>
                                 {lead.status}
                              </span>
                              <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            )}

            {/* VUE: PARTENAIRES (ADMIN ONLY) */}
            {activeTab === 'partners' && user.role === 'ADMIN' && (
                <div className="space-y-4 pb-20">
                   {!selectedPartnerId ? (
                       // 1. Liste des partenaires
                       <>
                           <h2 className="text-lg font-bold mb-4">Liste des Apporteurs ({MOCK_PARTNERS.length})</h2>
                           <div className="grid gap-4 md:grid-cols-2">
                               {MOCK_PARTNERS.map(partner => (
                                   <div 
                                     key={partner.id} 
                                     onClick={() => setSelectedPartnerId(partner.id)}
                                     className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:shadow-md transition-all flex justify-between items-center"
                                   >
                                       <div className="flex items-center gap-4">
                                           <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
                                               {partner.name.charAt(0)}
                                           </div>
                                           <div>
                                               <h3 className="font-bold text-slate-900">{partner.name}</h3>
                                               <p className="text-sm text-slate-500">{partner.email}</p>
                                           </div>
                                       </div>
                                       <div className="text-right">
                                           <p className="text-lg font-bold text-sky-600">{leads.filter(l => l.partnerId === partner.id).length} dossiers</p>
                                           <p className="text-xs text-slate-400">Total: {partner.totalCommission}€</p>
                                       </div>
                                   </div>
                               ))}
                           </div>
                       </>
                   ) : (
                       // 2. Détail d'un partenaire (Ses clients)
                       <>
                           <button 
                             onClick={() => setSelectedPartnerId(null)}
                             className="flex items-center gap-2 text-slate-500 font-bold mb-4 hover:text-slate-800"
                           >
                               <ChevronLeft size={20} /> Retour liste
                           </button>
                           
                           <div className="bg-sky-50 p-4 rounded-xl border border-sky-100 mb-6 flex justify-between items-center">
                               <h2 className="text-lg font-bold text-sky-900">
                                   Clients de {MOCK_PARTNERS.find(p => p.id === selectedPartnerId)?.name}
                               </h2>
                               <span className="text-sky-700 font-bold bg-white/50 px-3 py-1 rounded-lg">
                                   {leads.filter(l => l.partnerId === selectedPartnerId).length} Dossiers
                               </span>
                           </div>

                           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                               {leads.filter(l => l.partnerId === selectedPartnerId).length === 0 ? (
                                   <p className="text-slate-500 italic">Aucun dossier pour ce partenaire.</p>
                               ) : (
                                   leads.filter(l => l.partnerId === selectedPartnerId).map((lead) => (
                                    <div key={lead.id} onClick={() => setSelectedLead(lead)} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden hover:shadow-md transition-all cursor-pointer">
                                       <div className={`absolute top-0 left-0 w-1 h-full ${lead.status === LeadStatus.SIGNED ? 'bg-emerald-500' : 'bg-sky-500'}`}></div>
                                       <div className="flex justify-between items-start mb-3 pl-2">
                                          <div>
                                             <h3 className="font-bold text-slate-900 text-lg">{lead.name}</h3>
                                             <p className="text-slate-500 text-sm">{lead.phone}</p>
                                          </div>
                                          <div className="text-right">
                                             <p className="font-bold text-slate-900">{lead.estimatedCommission}€</p>
                                          </div>
                                       </div>
                                       <div className="pl-2 pt-3 border-t border-slate-50 flex justify-between items-center">
                                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase border ${getStatusColor(lead.status)}`}>
                                             {lead.status}
                                          </span>
                                          <ChevronRight size={18} className="text-slate-300" />
                                       </div>
                                    </div>
                                   ))
                               )}
                           </div>
                       </>
                   )}
                </div>
            )}

            {/* VUE: GAINS (Rempli) */}
            {activeTab === 'commissions' && (
               <div className="space-y-6 pb-20">
                   <div className="bg-slate-900 p-6 rounded-xl text-white shadow-lg">
                      <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Total Gagné (2025)</p>
                      <h2 className="text-4xl font-bold mb-6">12 450,00 €</h2>
                      <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={evolutionData}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.5}/>
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                            </AreaChart>
                        </ResponsiveContainer>
                      </div>
                   </div>

                   <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                       <h3 className="font-bold text-slate-900 mb-4">Répartition des ventes</h3>
                       <div className="h-64 w-full">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={productData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={90} tick={{fontSize: 11, fill: '#64748b'}} />
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                                <Bar dataKey="value" fill="#0ea5e9" radius={[0, 4, 4, 0]} barSize={24}>
                                    <LabelList dataKey="value" position="right" fill="#0f172a" fontSize={12} fontWeight="bold" />
                                </Bar>
                            </BarChart>
                         </ResponsiveContainer>
                       </div>
                   </div>

                   <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                       <div className="p-4 bg-slate-50 border-b border-slate-100">
                           <h3 className="font-bold text-slate-900">Derniers Paiements</h3>
                       </div>
                       {[1,2,3].map(i => (
                           <div key={i} className="p-4 border-b border-slate-50 flex justify-between items-center">
                               <div>
                                   <p className="font-bold text-slate-800">Virement #{202300 + i}</p>
                                   <p className="text-xs text-slate-500">12 Juin 2025</p>
                               </div>
                               <span className="text-emerald-600 font-bold">+ 850,00 €</span>
                           </div>
                       ))}
                   </div>
               </div>
            )}

            {/* VUE: PROFIL (Settings) */}
            {activeTab === 'settings' && (
               <div className="space-y-6 pb-20">
                  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                     <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-400 to-cyan-300 flex items-center justify-center text-2xl font-bold text-white shadow-md">
                        {user.name.charAt(0)}
                     </div>
                     <div>
                        <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
                            {user.role}
                        </span>
                     </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                      <button className="w-full p-4 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <span className="font-medium text-slate-700">Modifier mes informations</span>
                          <ChevronRight size={18} className="text-slate-300"/>
                      </button>
                      <button className="w-full p-4 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <span className="font-medium text-slate-700">RIB & Paiement</span>
                          <ChevronRight size={18} className="text-slate-300"/>
                      </button>
                      <button className="w-full p-4 flex items-center justify-between border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <span className="font-medium text-slate-700">Contrat Partenaire</span>
                          <ChevronRight size={18} className="text-slate-300"/>
                      </button>
                      <button className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                          <span className="font-medium text-slate-700">Support & Aide</span>
                          <ChevronRight size={18} className="text-slate-300"/>
                      </button>
                  </div>

                  <div className="lg:hidden">
                    <button 
                        onClick={onLogout}
                        className="w-full py-4 bg-red-50 text-red-600 font-bold rounded-xl border border-red-100 flex items-center justify-center gap-2 active:bg-red-100 transition-colors"
                    >
                        <LogOut size={20} />
                        Déconnexion
                    </button>
                  </div>
                  
                  <p className="text-center text-xs text-slate-400 mt-4">Version 2.2.0 (Build 50)</p>
               </div>
            )}
        </div>
      </main>

      {/* --- MODALES --- */}

      {/* 1. MODAL DÉTAIL CLIENT (Admin & Lecture) */}
      {selectedLead && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setSelectedLead(null)}></div>
            <div className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up sm:animate-scale-up max-h-[95vh] flex flex-col">
                
                <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Détail du dossier</p>
                        <h3 className="font-bold text-xl text-slate-900">{selectedLead.name}</h3>
                        {user.role === 'ADMIN' && (
                            <p className="text-xs text-sky-600">Apporté par : {selectedLead.partnerName}</p>
                        )}
                    </div>
                    <button onClick={() => setSelectedLead(null)} className="p-2 bg-white rounded-full border border-slate-200"><X size={20} /></button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    {/* Status Section */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">État d'avancement</p>
                        {user.role === 'ADMIN' ? (
                            // ADMIN : Select pour changer le statut
                            <div className="space-y-3">
                                <select 
                                    value={selectedLead.status}
                                    onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadStatus)}
                                    className="w-full p-3 rounded-lg border border-slate-300 font-bold text-slate-700 bg-white"
                                >
                                    {Object.values(LeadStatus).map(s => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                <p className="text-xs text-amber-600 flex items-center gap-1"><Edit2 size={10}/> Mode Admin actif</p>
                            </div>
                        ) : (
                            // USER : Affichage simple
                            <div className={`p-3 rounded-lg border text-center font-bold ${getStatusColor(selectedLead.status)}`}>
                                {selectedLead.status}
                            </div>
                        )}
                    </div>

                    {/* Info Contact */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600"><Phone size={20}/></div>
                            <div>
                                <p className="text-xs text-slate-400">Téléphone</p>
                                <a href={`tel:${selectedLead.phone}`} className="font-bold text-slate-900 underline decoration-sky-300 decoration-2">{selectedLead.phone}</a>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600"><Mail size={20}/></div>
                            <div>
                                <p className="text-xs text-slate-400">Email</p>
                                <a href={`mailto:${selectedLead.email}`} className="font-bold text-slate-900">{selectedLead.email}</a>
                            </div>
                        </div>
                    </div>

                    {/* Prestations */}
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Prestations</p>
                        <div className="flex flex-wrap gap-2">
                            {selectedLead.products.map(p => (
                                <div key={p} className="bg-slate-100 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 border border-slate-200">
                                    {p}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Admin Actions */}
                    {user.role === 'ADMIN' && (
                        <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-3">
                             <button className="py-3 rounded-xl bg-slate-100 text-slate-600 font-bold flex items-center justify-center gap-2">
                                <Edit2 size={16}/> Éditer
                             </button>
                             <button 
                                onClick={() => handleDeleteLead(selectedLead.id)}
                                className="py-3 rounded-xl bg-red-50 text-red-600 font-bold flex items-center justify-center gap-2"
                             >
                                <Trash2 size={16}/> Supprimer
                             </button>
                        </div>
                    )}
                </div>
            </div>
          </div>
      )}

      {/* 2. MODAL "AJOUTER UN CLIENT" */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" onClick={() => setIsAddModalOpen(false)}></div>
          
          <div className="relative bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-slide-up sm:animate-scale-up max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="font-bold text-lg text-slate-900">Nouveau Dossier</h3>
               <button onClick={() => setIsAddModalOpen(false)} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 border border-slate-200">
                  <X size={20} />
               </button>
            </div>
            <form onSubmit={handleCreateLead} className="p-6 overflow-y-auto space-y-6">
               <div className="space-y-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Coordonnées du prospect</p>
                  <div className="bg-slate-50 p-4 rounded-xl space-y-4 border border-slate-100">
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                        <input 
                          type="text" 
                          placeholder="Nom complet" 
                          className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                          required
                          value={newLeadForm.name}
                          onChange={e => setNewLeadForm({...newLeadForm, name: e.target.value})}
                        />
                    </div>
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                              type="tel" 
                              placeholder="Tél." 
                              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                              required
                              value={newLeadForm.phone}
                              onChange={e => setNewLeadForm({...newLeadForm, phone: e.target.value})}
                            />
                        </div>
                        <div className="relative flex-1">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                              type="email" 
                              placeholder="Email (opt)" 
                              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none font-medium"
                              value={newLeadForm.email}
                              onChange={e => setNewLeadForm({...newLeadForm, email: e.target.value})}
                            />
                        </div>
                    </div>
                  </div>
               </div>
               <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Prestations (Cumulables)</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                     {COMMISSION_RATES.map((rate) => {
                       const isSelected = newLeadForm.products.includes(rate.product);
                       return (
                         <button
                           type="button"
                           key={rate.product}
                           onClick={() => toggleProduct(rate.product)}
                           className={`relative p-3 rounded-xl border text-left transition-all duration-200 flex flex-col gap-2 ${isSelected ? 'bg-sky-50 border-sky-500 ring-1 ring-sky-500' : 'bg-white border-slate-200'}`}
                         >
                           {isSelected && <div className="absolute top-2 right-2 w-4 h-4 bg-sky-500 rounded-full flex items-center justify-center"><Check size={10} className="text-white" /></div>}
                           <div className={`p-1.5 rounded-lg w-fit ${isSelected ? 'bg-sky-200 text-sky-700' : 'bg-slate-100 text-slate-500'}`}>{getProductIcon(rate.product)}</div>
                           <div>
                              <p className={`font-bold text-xs ${isSelected ? 'text-sky-900' : 'text-slate-700'}`}>{rate.product}</p>
                              <p className="text-[10px] text-slate-400">~{(rate.min + rate.max)/2}€ com.</p>
                           </div>
                         </button>
                       );
                     })}
                  </div>
               </div>
            </form>
            <div className="p-4 border-t border-slate-100 bg-slate-50 sticky bottom-0">
               <div className="flex justify-between items-center mb-4 px-2">
                  <span className="text-sm font-medium text-slate-500">Commission estimée</span>
                  <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-cyan-500">{currentTotalCommission} €</span>
               </div>
               <button onClick={handleCreateLead} disabled={newLeadForm.products.length === 0} className={`w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 shadow-lg transition-all ${newLeadForm.products.length === 0 ? 'bg-slate-300 cursor-not-allowed shadow-none' : 'bg-gradient-to-r from-sky-500 to-cyan-400'}`}>
                 <CheckCircle size={20} /> Valider le dossier
               </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 px-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex justify-between items-center h-16 relative px-2">
            
            {/* Left Items */}
            <div className="flex-1 flex justify-around">
                <button onClick={() => setActiveTab('dashboard')} className={`flex flex-col items-center justify-center w-12 h-full gap-1 ${activeTab === 'dashboard' ? 'text-sky-600' : 'text-slate-400'}`}>
                    <LayoutDashboard size={22} className={activeTab === 'dashboard' ? 'stroke-[2.5px]' : ''} />
                    <span className="text-[10px] font-medium">Accueil</span>
                </button>
                <button onClick={() => setActiveTab('leads')} className={`flex flex-col items-center justify-center w-12 h-full gap-1 ${activeTab === 'leads' ? 'text-sky-600' : 'text-slate-400'}`}>
                    <FileText size={22} className={activeTab === 'leads' ? 'stroke-[2.5px]' : ''} />
                    <span className="text-[10px] font-medium">Dossiers</span>
                </button>
            </div>

            {/* CENTER FLOATING PLUS BUTTON */}
            <div className="relative -top-6 mx-2">
                <button onClick={() => setIsAddModalOpen(true)} className="bg-gradient-to-r from-sky-500 to-cyan-400 p-4 rounded-full text-white shadow-lg shadow-sky-500/30 transform transition-transform hover:scale-105 active:scale-95 border-4 border-slate-50">
                    <Plus size={28} strokeWidth={3} />
                </button>
            </div>

            {/* Right Items */}
            <div className="flex-1 flex justify-around">
                {user.role === 'ADMIN' ? (
                     <button onClick={() => setActiveTab('partners')} className={`flex flex-col items-center justify-center w-12 h-full gap-1 ${activeTab === 'partners' ? 'text-sky-600' : 'text-slate-400'}`}>
                        <Briefcase size={22} className={activeTab === 'partners' ? 'stroke-[2.5px]' : ''} />
                        <span className="text-[10px] font-medium">Partenaires</span>
                     </button>
                ) : (
                    <button onClick={() => setActiveTab('commissions')} className={`flex flex-col items-center justify-center w-12 h-full gap-1 ${activeTab === 'commissions' ? 'text-sky-600' : 'text-slate-400'}`}>
                        <Wallet size={22} className={activeTab === 'commissions' ? 'stroke-[2.5px]' : ''} />
                        <span className="text-[10px] font-medium">Gains</span>
                    </button>
                )}
                
                <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center justify-center w-12 h-full gap-1 ${activeTab === 'settings' ? 'text-sky-600' : 'text-slate-400'}`}>
                    <UserIcon size={22} className={activeTab === 'settings' ? 'stroke-[2.5px]' : ''} />
                    <span className="text-[10px] font-medium">Profil</span>
                </button>
            </div>
        </div>
      </nav>

    </div>
  );
};

export default Dashboard;