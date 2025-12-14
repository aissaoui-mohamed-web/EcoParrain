
import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  FileText, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  Clock,
  Phone,
  Search,
  LogOut,
  Bell,
  Pencil,
  Loader2,
  X,
  Shield,
  Briefcase,
  Network,
  ListTodo,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Check,
  PieChart as PieChartIcon,
  BarChart3
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area, PieChart, Pie, Legend
} from 'recharts';
import { Lead, LeadStatus, ProductType, COMMISSION_RATES, User, AppNotification } from '../types';
import AiCoach from './AiCoach';

// Mock Data removed - Application starts empty
const INITIAL_LEADS: Lead[] = [];

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

interface PartnerSummary {
    id: string;
    name: string;
    leadCount: number;
    totalCommission: number;
    lastActive: string;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const isAdmin = user.role === 'ADMIN';
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'coach' | 'partners'>('overview');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  
  // "Central Brain" logic: We load ALL leads from storage
  const [allLeads, setAllLeads] = useState<Lead[]>(() => {
    const savedLeads = localStorage.getItem('ecoparrain_all_leads');
    // If no leads in new DB, check old DB for migration or use initial
    if (!savedLeads) {
        const oldLeads = localStorage.getItem('ecoparrain_leads');
        if (oldLeads) {
            // Migrate old leads to new structure (add partner info)
            const parsed = JSON.parse(oldLeads).map((l: any) => ({
                ...l,
                partnerId: l.partnerId || user.id,
                partnerName: l.partnerName || user.name
            }));
            return parsed;
        }
        return INITIAL_LEADS;
    }
    return JSON.parse(savedLeads);
  });

  // --- NOTIFICATION SYSTEM ---
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Load notifications from local storage on mount
  useEffect(() => {
    const savedNotifs = localStorage.getItem('ecoparrain_notifications');
    if (savedNotifs) {
      const parsed: AppNotification[] = JSON.parse(savedNotifs);
      // Filter notifications relevant to THIS user
      setNotifications(parsed.filter(n => n.userId === user.id));
    }
  }, [user.id]);

  // Click outside to close notification dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (notifId: string) => {
    const updated = notifications.map(n => n.id === notifId ? { ...n, isRead: true } : n);
    setNotifications(updated);
    updateGlobalNotifications(updated);
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    updateGlobalNotifications([], true); // Remove all for this user
  };

  // Helper to sync with localStorage (which contains ALL users' notifications)
  const updateGlobalNotifications = (userNotifs: AppNotification[], removeAllForUser = false) => {
    const allSaved = JSON.parse(localStorage.getItem('ecoparrain_notifications') || '[]');
    // Remove old ones for this user
    const others = allSaved.filter((n: AppNotification) => n.userId !== user.id);
    // Combine
    const final = removeAllForUser ? others : [...others, ...userNotifs];
    localStorage.setItem('ecoparrain_notifications', JSON.stringify(final));
  };


  // Filter leads based on Role
  // Admin sees EVERYTHING. Partner sees ONLY THEIRS.
  const displayedLeads = isAdmin 
    ? allLeads 
    : allLeads.filter(l => l.partnerId === user.id);

  // Compute Partners List for Admin
  const partnersList: PartnerSummary[] = isAdmin ? allLeads.reduce((acc: PartnerSummary[], lead) => {
    let partner = acc.find(p => p.id === lead.partnerId);
    if (!partner) {
        partner = {
            id: lead.partnerId,
            name: lead.partnerName || 'Inconnu',
            leadCount: 0,
            totalCommission: 0,
            lastActive: lead.dateAdded
        };
        acc.push(partner);
    }
    partner.leadCount++;
    if ([LeadStatus.INSTALLED, LeadStatus.PAID].includes(lead.status)) {
        partner.totalCommission += lead.estimatedCommission;
    }
    // Update last active if current lead is newer
    if (new Date(lead.dateAdded) > new Date(partner.lastActive)) {
        partner.lastActive = lead.dateAdded;
    }
    return acc;
  }, []) : [];


  const [showModal, setShowModal] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  
  // States for submission simulation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    product: ProductType.SOLAR,
    status: LeadStatus.NEW
  });

  // Save to LocalStorage whenever All Leads change (Simulating Central Database Update)
  useEffect(() => {
    localStorage.setItem('ecoparrain_all_leads', JSON.stringify(allLeads));
  }, [allLeads]);

  // Clear notification after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Derived Stats based on DISPLAYED leads
  const totalCommission = displayedLeads
    .filter(l => l.status === LeadStatus.PAID || l.status === LeadStatus.INSTALLED)
    .reduce((acc, curr) => acc + curr.estimatedCommission, 0);
  
  const pendingCommission = displayedLeads
    .filter(l => l.status !== LeadStatus.PAID && l.status !== LeadStatus.INSTALLED && l.status !== LeadStatus.NEW)
    .reduce((acc, curr) => acc + curr.estimatedCommission, 0);

  const totalLeads = displayedLeads.length;

  // --- CHART DATA CALCULATION HELPER ---
  const calculateAnalytics = (leads: Lead[]) => {
    // 1. Evolution Data
    const monthlyDataMap = new Map<string, number>();
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    const currentYear = new Date().getFullYear();
    
    months.forEach((m) => monthlyDataMap.set(m, 0));

    leads.forEach(lead => {
      const date = new Date(lead.dateAdded);
      if (date.getFullYear() === currentYear && lead.status !== LeadStatus.NEW) {
        const monthIndex = date.getMonth();
        const monthName = months[monthIndex];
        const currentVal = monthlyDataMap.get(monthName) || 0;
        monthlyDataMap.set(monthName, currentVal + lead.estimatedCommission);
      }
    });

    const evolutionData = Array.from(monthlyDataMap).map(([name, value]) => ({ name, value }));

    // 2. Product Distribution
    const productCountMap = new Map<string, number>();
    leads.forEach(lead => {
       const current = productCountMap.get(lead.product) || 0;
       productCountMap.set(lead.product, current + 1);
    });

    const COLORS = ['#059669', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
    const productData = Array.from(productCountMap).map(([name, value], index) => ({
      name,
      value,
      color: COLORS[index % COLORS.length]
    }));

    if (productData.length === 0) {
        productData.push({ name: 'Aucune donnée', value: 1, color: '#e2e8f0' });
    }

    return { evolutionData, productData };
  };

  // Calculate global analytics for the Dashboard view
  const { evolutionData, productData } = calculateAnalytics(displayedLeads);

  const handleOpenAddModal = () => {
    setEditingLeadId(null);
    setLeadForm({ name: '', phone: '', email: '', product: ProductType.SOLAR, status: LeadStatus.NEW });
    setShowModal(true);
  };

  const handleOpenEditModal = (lead: Lead) => {
    setEditingLeadId(lead.id);
    setLeadForm({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      product: lead.product,
      status: lead.status
    });
    setShowModal(true);
  };

  const handleDeleteLead = async () => {
    if (!editingLeadId) return;

    if (window.confirm("Êtes-vous sûr de vouloir supprimer définitivement ce dossier ? Cette action est irréversible.")) {
      setIsSubmitting(true);
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 600));

      setAllLeads(prev => prev.filter(l => l.id !== editingLeadId));
      
      setNotification({ message: 'Dossier supprimé avec succès.', type: 'success' });
      setIsSubmitting(false);
      setShowModal(false);
      setEditingLeadId(null);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate Network Request (Faster for Admin)
    await new Promise(resolve => setTimeout(resolve, isAdmin ? 500 : 1200));

    const rate = COMMISSION_RATES.find(r => r.product === leadForm.product);
    const avgCommission = rate ? (rate.min + rate.max) / 2 : 0;

    if (editingLeadId) {
      // Find old lead to compare status
      const oldLead = allLeads.find(l => l.id === editingLeadId);

      // --- LOGIC NOTIFICATION ---
      // Si c'est un ADMIN qui modifie le dossier d'un partenaire et que le statut change
      if (isAdmin && oldLead && oldLead.partnerId !== user.id && oldLead.status !== leadForm.status) {
        const newNotif: AppNotification = {
          id: Date.now().toString(),
          userId: oldLead.partnerId, // Envoi au partenaire
          leadId: oldLead.id,
          title: "Mise à jour dossier",
          message: `Le statut du dossier ${oldLead.name} est passé de "${oldLead.status}" à "${leadForm.status}".`,
          date: new Date().toISOString(),
          isRead: false,
          type: 'STATUS_CHANGE'
        };
        
        // Save to global notifications storage
        const currentNotifs = JSON.parse(localStorage.getItem('ecoparrain_notifications') || '[]');
        localStorage.setItem('ecoparrain_notifications', JSON.stringify([newNotif, ...currentNotifs]));
      }

      // Update existing lead in the global list
      setAllLeads(prev => prev.map(lead => 
        lead.id === editingLeadId 
          ? { 
              ...lead, 
              name: leadForm.name, 
              phone: leadForm.phone, 
              email: leadForm.email, 
              product: leadForm.product,
              status: leadForm.status, // Update Status
              estimatedCommission: avgCommission 
            } 
          : lead
      ));
      setNotification({ message: 'Dossier mis à jour avec succès.', type: 'success' });
    } else {
      // Create new lead
      const newLead: Lead = {
        id: Date.now().toString(),
        // IMPORTANT: We tag the lead with the current user's ID and Name
        partnerId: user.id,
        partnerName: user.name,
        name: leadForm.name,
        phone: leadForm.phone,
        email: leadForm.email,
        product: leadForm.product,
        status: LeadStatus.NEW,
        dateAdded: new Date().toISOString().split('T')[0],
        estimatedCommission: avgCommission
      };
      setAllLeads(prev => [newLead, ...prev]);
      
      const msg = isAdmin 
        ? "Dossier ajouté manuellement à la base centrale."
        : "Dossier transmis au siège ! Notification envoyée.";
      setNotification({ message: msg, type: 'success' });
      
      setActiveTab('leads');
    }

    setIsSubmitting(false);
    setShowModal(false);
    setLeadForm({ name: '', phone: '', email: '', product: ProductType.SOLAR, status: LeadStatus.NEW });
    setEditingLeadId(null);
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-slate-100 text-slate-700';
      case LeadStatus.CONTACTED: return 'bg-blue-100 text-blue-700';
      case LeadStatus.MEETING: return 'bg-indigo-100 text-indigo-700';
      case LeadStatus.QUOTE: return 'bg-purple-100 text-purple-700';
      case LeadStatus.SIGNED: return 'bg-green-100 text-green-700';
      case LeadStatus.INSTALLED: return 'bg-green-100 text-green-800 border border-green-200';
      case LeadStatus.PAID: return 'bg-green-100 text-green-800 font-bold';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[60] animate-fade-in-up">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <div className="bg-emerald-500 rounded-full p-1">
              <CheckCircle2 size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">Mise à jour effectuée</p>
              <p className="text-xs text-slate-300">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="ml-4 text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar (Desktop) */}
      <aside className={`w-72 text-white hidden md:flex flex-col fixed h-full z-20 shadow-xl ${isAdmin ? 'bg-slate-900' : 'bg-slate-900'}`}>
        <div className="p-8 border-b border-white/10">
          <h1 className="text-2xl font-bold tracking-tight">EcoParrain<span className="text-emerald-500">.</span></h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold flex items-center gap-1">
             {isAdmin ? <><Shield size={12} className="text-emerald-400"/> Espace Siège</> : 'Espace Partenaire'}
          </p>
        </div>
        
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-4">Pilotage</div>
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard size={20} /> Vue d'ensemble
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === 'leads' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Users size={20} /> {isAdmin ? 'Tous les Dossiers' : 'Mes Filleuls'}
            <span className="ml-auto bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full">{totalLeads}</span>
          </button>
          
          {isAdmin && (
             <button 
                onClick={() => { setActiveTab('partners'); setSelectedPartnerId(null); }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === 'partners' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                <Network size={20} /> Réseau Partenaires
                <span className="ml-auto bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full">{partnersList.length}</span>
              </button>
          )}

          {!isAdmin && (
            <button 
              onClick={() => setActiveTab('coach')}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === 'coach' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
            >
              <CheckCircle2 size={20} /> Coach IA
              <span className="ml-auto bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold px-2 py-0.5 rounded-full text-black shadow-sm">PRO</span>
            </button>
          )}
          
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-8">Outils</div>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors text-sm">
            <FileText size={20} /> {isAdmin ? 'Exports Comptables' : 'Kit Marketing'}
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
           <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs ${isAdmin ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{isAdmin ? 'Administrateur' : 'Partenaire'}</p>
              </div>
           </div>
           <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-2 text-slate-400 hover:text-red-400 transition-colors text-sm"
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-72 p-4 md:p-8 overflow-y-auto max-w-[1600px] pb-24 md:pb-8">
        
        {/* Top Header Mobile */}
        <div className="md:hidden mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold ${isAdmin ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
               EP
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">EcoParrain</h1>
          </div>
          
          <div className="flex items-center gap-3" ref={notificationRef}>
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 relative text-slate-500 hover:text-emerald-600 transition-colors"
            >
                <Bell size={22} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
            </button>
          </div>
        </div>

        {/* Notifications Dropdown */}
         {showNotifications && (
            <div className="fixed top-20 right-4 md:absolute md:top-14 md:right-0 w-[calc(100vw-2rem)] md:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-[60] animate-fade-in-up overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">Notifications</h3>
                    {notifications.length > 0 && (
                        <button 
                            onClick={handleClearAllNotifications}
                            className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1"
                        >
                            <Trash2 size={12} /> Tout effacer
                        </button>
                    )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map(notif => (
                            <div 
                                key={notif.id} 
                                onClick={() => handleMarkAsRead(notif.id)}
                                className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-emerald-50/50' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${notif.type === 'STATUS_CHANGE' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {notif.type === 'STATUS_CHANGE' ? 'Mise à jour' : 'Info'}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        {new Date(notif.date).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>
                                    {notif.title}
                                </h4>
                                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                                    {notif.message}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-slate-400">
                            <Bell size={24} className="mx-auto mb-2 opacity-20" />
                            <p className="text-sm">Aucune notification.</p>
                        </div>
                    )}
                </div>
            </div>
         )}


        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 flex items-center gap-2">
                    {isAdmin && <Shield className="text-emerald-600 w-6 h-6 md:w-8 md:h-8"/>}
                    Tableau de Bord {isAdmin ? 'National' : ''}
                </h2>
                <p className="text-slate-500 mt-1 text-sm md:text-base">
                    {isAdmin 
                        ? "Vue globale de l'activité du réseau de parrainage." 
                        : `Bon retour, ${user.name} ! Voici vos performances.`
                    }
                </p>
              </div>
              
              <div className="hidden md:flex gap-3 relative" ref={notificationRef}>
                 <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition-colors relative"
                 >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-slate-50">
                            {unreadCount}
                        </span>
                    )}
                 </button>

                <button 
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-emerald-600/20"
                >
                  <Plus size={20} /> {isAdmin ? 'Ajout Manuel' : 'Nouveau Prospect'}
                </button>
              </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Wallet size={24} />
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                </div>
                <p className="text-sm text-slate-500 font-medium mb-1">
                    {isAdmin ? 'Volume d\'Affaires Apporté' : 'Commissions Gagnées'}
                </p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{totalCommission.toLocaleString()} €</h3>
              </div>
              
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <TrendingUp size={24} />
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium mb-1">{isAdmin ? 'Pipeline Commercial' : 'En cours de validation'}</p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{pendingCommission.toLocaleString()} €</h3>
              </div>
              
              <div className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Users size={24} />
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium mb-1">{isAdmin ? 'Total Dossiers Réseau' : 'Total Prospects'}</p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">{totalLeads}</h3>
              </div>
            </div>

            {/* --- ADVANCED CHARTS SECTION --- */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              
              {/* Chart 1: Evolution of Commissions (Area Chart) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <TrendingUp size={18} className="text-slate-400"/>
                    Évolution {isAdmin ? 'du CA' : 'des Gains'}
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
                     <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Année {new Date().getFullYear()}
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={evolutionData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `${value}€`} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: number) => [`${value} €`, 'Commission']}
                        labelStyle={{color: '#64748b', marginBottom: '4px'}}
                      />
                      <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart 2: Product Distribution (Pie Chart) */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                    <PieChartIcon size={18} className="text-slate-400"/>
                    Répartition par Produit
                  </h3>
                </div>
                <div className="h-64 w-full flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={productData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {productData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                      </Pie>
                      <Tooltip 
                         contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      />
                      <Legend 
                        layout="vertical" 
                        verticalAlign="middle" 
                        align="right"
                        iconType="circle"
                        iconSize={8}
                        wrapperStyle={{ fontSize: '12px', fontWeight: 500, color: '#475569' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* Recent Activity List (Full Width now) */}
            <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                  <Clock size={18} className="text-slate-400"/>
                  Activité Récente
                </h3>
                <div className="space-y-4">
                  {displayedLeads.slice(0, 4).map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-slate-100" onClick={() => handleOpenEditModal(lead)}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${lead.status === LeadStatus.NEW ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-600'}`}>
                           {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{lead.name}</p>
                          <div className="flex gap-2 text-xs text-slate-500">
                             {isAdmin && <span className="font-medium text-emerald-600">{lead.partnerName} •</span>}
                             <span>{lead.product}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                  ))}
                  {displayedLeads.length === 0 && (
                      <div className="text-center py-8 text-slate-400 text-sm">Aucune activité récente.</div>
                  )}
                </div>
                <button 
                  onClick={() => setActiveTab('leads')}
                  className="w-full mt-6 py-3 text-slate-600 text-sm font-medium hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors border border-dashed border-slate-200"
                >
                  Voir tous les dossiers
                </button>
            </div>
          </div>
        )}
        
        {/* NEW TAB: Partners Network (Admin Only) */}
        {activeTab === 'partners' && isAdmin && (
            selectedPartnerId ? (
                // DETAIL VIEW OF A PARTNER
                <div className="space-y-6 animate-fade-in">
                    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => setSelectedPartnerId(null)}
                                className="p-2 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-sm"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-slate-900 flex items-center gap-2">
                                    {partnersList.find(p => p.id === selectedPartnerId)?.name}
                                    <span className="hidden md:inline text-sm font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                        Partenaire
                                    </span>
                                </h2>
                                <p className="text-slate-500 text-sm">
                                    Détail complet des dossiers apportés.
                                </p>
                            </div>
                        </div>
                        
                        {/* Partner Stats Summary */}
                        <div className="flex gap-3 overflow-x-auto pb-2 md:pb-0">
                            <div className="bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 shrink-0">
                                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Dossiers</p>
                                <p className="text-xl font-bold text-emerald-600">
                                    {partnersList.find(p => p.id === selectedPartnerId)?.leadCount || 0}
                                </p>
                            </div>
                            <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 shrink-0">
                                <p className="text-xs font-bold text-blue-800 uppercase tracking-wider">Commissions</p>
                                <p className="text-xl font-bold text-blue-600">
                                    {partnersList.find(p => p.id === selectedPartnerId)?.totalCommission || 0} €
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* --- INJECTED CHARTS FOR PARTNER DETAIL --- */}
                    {(() => {
                        const partnerLeads = allLeads.filter(l => l.partnerId === selectedPartnerId);
                        const { evolutionData: partnerEvo, productData: partnerProd } = calculateAnalytics(partnerLeads);
                        
                        return (
                          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                             {/* Chart 1: Partner Evolution */}
                             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="flex justify-between items-center mb-6">
                                   <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                    <TrendingUp size={18} className="text-slate-400"/>
                                    Performance du Partenaire
                                  </h3>
                                </div>
                                <div className="h-64">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={partnerEvo}>
                                      <defs>
                                        <linearGradient id="colorPartner" x1="0" y1="0" x2="0" y2="1">
                                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                      </defs>
                                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `${value}€`} />
                                      <Tooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                        formatter={(value: number) => [`${value} €`, 'Commission']}
                                      />
                                      <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorPartner)" />
                                    </AreaChart>
                                  </ResponsiveContainer>
                                </div>
                             </div>

                             {/* Chart 2: Partner Distribution */}
                             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                 <div className="flex justify-between items-center mb-6">
                                   <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                                    <PieChartIcon size={18} className="text-slate-400"/>
                                    Ses Produits Favoris
                                  </h3>
                                </div>
                                <div className="h-64 w-full flex justify-center">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                      <Pie
                                        data={partnerProd}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                      >
                                        {partnerProd.map((entry, index) => (
                                          <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                        ))}
                                      </Pie>
                                      <Tooltip 
                                         contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                      />
                                      <Legend 
                                        layout="vertical" 
                                        verticalAlign="middle" 
                                        align="right"
                                        iconType="circle"
                                        iconSize={8}
                                        wrapperStyle={{ fontSize: '12px', fontWeight: 500, color: '#475569' }}
                                      />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </div>
                             </div>
                          </div>
                        );
                    })()}

                     {/* Mobile Card View for Partner Detail */}
                    <div className="md:hidden space-y-4">
                        {allLeads.filter(l => l.partnerId === selectedPartnerId).map((lead) => (
                            <div key={lead.id} onClick={() => handleOpenEditModal(lead)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm active:scale-[0.98] transition-transform">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h4 className="font-bold text-slate-900">{lead.name}</h4>
                                        <p className="text-xs text-slate-500 flex items-center gap-1"><Phone size={10}/> {lead.phone}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(lead.status)}`}>
                                        {lead.status}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-t border-slate-50 pt-3 mt-1">
                                    <span className="text-slate-500 text-xs">{new Date(lead.dateAdded).toLocaleDateString()}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{lead.product}</span>
                                        <span className="font-bold text-slate-900">{lead.estimatedCommission} €</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                                        <th className="p-5 font-semibold">Prospect</th>
                                        <th className="p-5 font-semibold">Coordonnées</th>
                                        <th className="p-5 font-semibold">Projet</th>
                                        <th className="p-5 font-semibold">Date</th>
                                        <th className="p-5 font-semibold">Statut</th>
                                        <th className="p-5 font-semibold text-right">Commission Est.</th>
                                        <th className="p-5 font-semibold w-16"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {allLeads.filter(l => l.partnerId === selectedPartnerId).map((lead) => (
                                        <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="p-5">
                                                <div className="font-semibold text-slate-900">{lead.name}</div>
                                                <div className="text-xs text-slate-400">ID: #{lead.id}</div>
                                            </td>
                                            <td className="p-5 text-sm text-slate-600">
                                                <div className="flex flex-col gap-1">
                                                    <span className="flex items-center gap-2"><Phone size={12} className="text-slate-400"/> {lead.phone}</span>
                                                    <span className="text-xs text-slate-400 flex items-center gap-2">{lead.email}</span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-sm">
                                                <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-medium text-xs border border-slate-200">
                                                    {lead.product}
                                                </span>
                                            </td>
                                            <td className="p-5 text-sm text-slate-500">{new Date(lead.dateAdded).toLocaleDateString('fr-FR')}</td>
                                            <td className="p-5">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="p-5 text-right font-bold text-slate-900">{lead.estimatedCommission} €</td>
                                            <td className="p-5">
                                                <button 
                                                    onClick={() => handleOpenEditModal(lead)}
                                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                    title="Modifier"
                                                >
                                                    <Pencil size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {allLeads.filter(l => l.partnerId === selectedPartnerId).length === 0 && (
                                        <tr>
                                            <td colSpan={7} className="p-16 text-center text-slate-500">
                                                <p className="text-lg font-medium text-slate-900">Aucun dossier pour ce partenaire</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                // LIST VIEW OF PARTNERS
                <div className="space-y-6 animate-fade-in">
                    <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Réseau Partenaires</h2>
                        <p className="text-slate-500 mt-1 text-sm md:text-base">
                            Liste de tous les apporteurs d'affaires actifs sur la plateforme.
                        </p>
                    </div>
                    </header>

                    {/* Mobile Partners List */}
                    <div className="md:hidden space-y-4">
                        {partnersList.length > 0 ? (
                             partnersList.map((partner) => (
                                <div key={partner.id} onClick={() => setSelectedPartnerId(partner.id)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm active:scale-[0.98] transition-transform">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                                            {partner.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{partner.name}</div>
                                            <div className="text-xs text-slate-400">ID: {partner.id}</div>
                                        </div>
                                        <div className="ml-auto">
                                           <ArrowRight size={20} className="text-slate-300" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-center">
                                        <div className="bg-slate-50 p-2 rounded-lg">
                                            <p className="text-xs text-slate-500">Dossiers</p>
                                            <p className="font-bold text-slate-900">{partner.leadCount}</p>
                                        </div>
                                        <div className="bg-emerald-50 p-2 rounded-lg">
                                            <p className="text-xs text-emerald-600">Commissions</p>
                                            <p className="font-bold text-emerald-700">{partner.totalCommission} €</p>
                                        </div>
                                    </div>
                                </div>
                             ))
                        ) : (
                            <div className="p-8 text-center text-slate-400">Aucun partenaire</div>
                        )}
                    </div>

                    <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="p-5 font-semibold">Partenaire</th>
                            <th className="p-5 font-semibold">Statut</th>
                            <th className="p-5 font-semibold text-center">Dossiers Apportés</th>
                            <th className="p-5 font-semibold text-right">Commissions Versées</th>
                            <th className="p-5 font-semibold">Dernière Activité</th>
                            <th className="p-5 font-semibold w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {partnersList.length > 0 ? (
                                partnersList.map((partner) => (
                                <tr 
                                    key={partner.id} 
                                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                                    onClick={() => setSelectedPartnerId(partner.id)}
                                >
                                    <td className="p-5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                                            {partner.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors">{partner.name}</div>
                                            <div className="text-xs text-slate-400">ID: {partner.id}</div>
                                        </div>
                                    </div>
                                    </td>
                                    <td className="p-5">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                            Actif
                                        </span>
                                    </td>
                                    <td className="p-5 text-center font-medium text-slate-700">
                                        {partner.leadCount}
                                    </td>
                                    <td className="p-5 text-right font-bold text-slate-900">
                                        {partner.totalCommission} €
                                    </td>
                                    <td className="p-5 text-sm text-slate-500">
                                        {new Date(partner.lastActive).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="p-5 text-slate-300 group-hover:text-emerald-500 transition-colors">
                                        <ArrowRight size={20} />
                                    </td>
                                </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-16 text-center text-slate-500">
                                        <div className="flex flex-col items-center">
                                            <Network size={32} className="text-slate-300 mb-4"/>
                                            <p className="text-lg font-medium text-slate-900">Aucun partenaire actif</p>
                                            <p className="text-sm">Le réseau ne contient encore aucune donnée de partenaires.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                        </table>
                    </div>
                    </div>
                </div>
            )
        )}

        {activeTab === 'leads' && (
          <div className="space-y-6 animate-fade-in">
             <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900">{isAdmin ? 'Dossiers Nationaux' : 'Mes Filleuls'}</h2>
                <p className="text-slate-500 mt-1 text-sm md:text-base">
                    {isAdmin 
                        ? "Gestion et suivi de tous les prospects transmis par le réseau." 
                        : "Gérez vos recommandations et suivez leur avancement technique."}
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-64" />
                </div>
                <button 
                  onClick={handleOpenAddModal}
                  className="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                >
                  <Plus size={20} />
                </button>
              </div>
            </header>
            
            {/* Mobile View - Cards */}
            <div className="md:hidden space-y-4">
                {displayedLeads.map(lead => (
                    <div key={lead.id} onClick={() => handleOpenEditModal(lead)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm active:scale-[0.98] transition-transform">
                    <div className="flex justify-between items-start mb-3">
                        <div>
                            <h4 className="font-bold text-slate-900">{lead.name}</h4>
                            <p className="text-xs text-slate-500">{lead.product}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(lead.status)}`}>
                            {lead.status}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <div className="text-slate-500">
                            {new Date(lead.dateAdded).toLocaleDateString()}
                        </div>
                        <div className="font-bold text-slate-900">
                            {lead.estimatedCommission} €
                        </div>
                    </div>
                    {isAdmin && (
                        <div className="mt-2 pt-2 border-t border-slate-50 text-xs text-emerald-600 font-medium">
                            Partenaire : {lead.partnerName}
                        </div>
                    )}
                    </div>
                ))}
                {displayedLeads.length === 0 && (
                     <div className="p-8 text-center text-slate-400">Aucun dossier</div>
                )}
            </div>

            {/* Desktop View - Table */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-5 font-semibold">Prospect</th>
                      {isAdmin && <th className="p-5 font-semibold text-emerald-700">Apporteur</th>}
                      <th className="p-5 font-semibold">Coordonnées</th>
                      <th className="p-5 font-semibold">Projet</th>
                      <th className="p-5 font-semibold">Date</th>
                      <th className="p-5 font-semibold">Statut</th>
                      <th className="p-5 font-semibold text-right">Commission Est.</th>
                      <th className="p-5 font-semibold w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="p-5">
                          <div className="font-semibold text-slate-900">{lead.name}</div>
                          <div className="text-xs text-slate-400">ID: #{lead.id}</div>
                        </td>
                        {isAdmin && (
                            <td className="p-5">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
                                        {lead.partnerName ? lead.partnerName.charAt(0) : '?'}
                                    </div>
                                    <span className="text-sm font-medium text-slate-700">{lead.partnerName || 'Inconnu'}</span>
                                </div>
                            </td>
                        )}
                        <td className="p-5 text-sm text-slate-600">
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-2"><Phone size={12} className="text-slate-400"/> {lead.phone}</span>
                            <span className="text-xs text-slate-400 flex items-center gap-2">{lead.email}</span>
                          </div>
                        </td>
                        <td className="p-5 text-sm">
                          <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-medium text-xs border border-slate-200">
                            {lead.product}
                          </span>
                        </td>
                        <td className="p-5 text-sm text-slate-500">{new Date(lead.dateAdded).toLocaleDateString('fr-FR')}</td>
                        <td className="p-5">
                          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-5 text-right font-bold text-slate-900">{lead.estimatedCommission} €</td>
                        <td className="p-5">
                          <button 
                            onClick={() => handleOpenEditModal(lead)}
                            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Pencil size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {displayedLeads.length === 0 && (
                <div className="p-16 text-center text-slate-500 flex flex-col items-center">
                  <div className="bg-slate-50 p-4 rounded-full mb-4">
                    <Users size={32} className="text-slate-300"/>
                  </div>
                  <p className="text-lg font-medium text-slate-900">Aucun dossier trouvé</p>
                  <p className="text-sm">La liste est actuellement vide.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Coach is only for Partners */}
        {activeTab === 'coach' && !isAdmin && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
             <header className="mb-4 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Coach Énergie IA</h2>
              <p className="text-slate-500 mt-2 text-sm md:text-lg">Votre assistant personnel disponible 24/7 pour vous aider à convaincre.</p>
            </header>
            
            <AiCoach />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <button className="text-left bg-emerald-50 p-5 rounded-xl border border-emerald-100 hover:bg-emerald-100 transition-colors group">
                <h4 className="font-bold text-emerald-800 mb-2 flex items-center gap-2">
                  <Phone className="w-4 h-4"/> Script d'appel
                </h4>
                <p className="text-sm text-emerald-700 leading-relaxed group-hover:text-emerald-900">
                  "Génère un script pour appeler un voisin et lui parler de panneaux solaires sans être intrusif."
                </p>
              </button>
              <button className="text-left bg-blue-50 p-5 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors group">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4"/> Traiter les objections
                </h4>
                <p className="text-sm text-blue-700 leading-relaxed group-hover:text-blue-900">
                  "Que répondre si on me dit que les pompes à chaleur sont bruyantes et chères ?"
                </p>
              </button>
               <button className="text-left bg-purple-50 p-5 rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors group">
                <h4 className="font-bold text-purple-800 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4"/> Arguments ROI
                </h4>
                <p className="text-sm text-purple-700 leading-relaxed group-hover:text-purple-900">
                  "Explique-moi simplement le retour sur investissement d'une isolation extérieure."
                </p>
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-2 flex justify-between items-center z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
            {/* Dashboard */}
            <button onClick={() => setActiveTab('overview')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'overview' ? 'text-emerald-600' : 'text-slate-400'}`}>
                <LayoutDashboard size={24} />
                <span className="text-[10px] font-medium">Accueil</span>
            </button>

            {/* Leads */}
            <button onClick={() => setActiveTab('leads')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'leads' ? 'text-emerald-600' : 'text-slate-400'}`}>
                <Users size={24} />
                <span className="text-[10px] font-medium">{isAdmin ? 'Dossiers' : 'Filleuls'}</span>
            </button>

            {/* Center Add Button (FAB-like but inline) */}
            <div className="relative -top-6">
                <button 
                    onClick={handleOpenAddModal}
                    className="bg-emerald-600 text-white p-4 rounded-full shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 transition-transform active:scale-95 border-4 border-slate-50"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Partners / Coach */}
            {isAdmin ? (
                    <button onClick={() => {setActiveTab('partners'); setSelectedPartnerId(null)}} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'partners' ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <Network size={24} />
                        <span className="text-[10px] font-medium">Réseau</span>
                    </button>
            ) : (
                    <button onClick={() => setActiveTab('coach')} className={`flex flex-col items-center gap-1 p-2 ${activeTab === 'coach' ? 'text-emerald-600' : 'text-slate-400'}`}>
                        <CheckCircle2 size={24} />
                        <span className="text-[10px] font-medium">Coach</span>
                    </button>
            )}

            {/* Logout */}
            <button onClick={onLogout} className="flex flex-col items-center gap-1 text-slate-400 p-2">
                <LogOut size={24} />
                <span className="text-[10px] font-medium">Sortir</span>
            </button>
      </div>

      {/* Add/Edit Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                 <h3 className="text-xl font-bold text-slate-900">
                   {editingLeadId ? 'Modifier le Dossier' : (isAdmin ? 'Ajout Manuel Admin' : 'Nouveau Prospect')}
                 </h3>
                 <p className="text-xs text-slate-500">
                   {editingLeadId ? 'Mettez à jour les informations ci-dessous.' : 'Remplissez les informations pour initier le dossier.'}
                 </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 bg-white rounded-full text-slate-400 hover:text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">
                <Plus className="rotate-45" size={20} />
              </button>
            </div>
            <form onSubmit={handleLeadSubmit} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nom complet du prospect</label>
                <input 
                  required
                  type="text" 
                  value={leadForm.name}
                  onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  placeholder="Ex: Pierre Durand"
                  disabled={isSubmitting}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Téléphone</label>
                  <input 
                    required
                    type="tel" 
                    value={leadForm.phone}
                    onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="06..."
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Email (Optionnel)</label>
                  <input 
                    type="email" 
                    value={leadForm.email}
                    onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                    placeholder="email@..."
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Type d'intérêt principal</label>
                <div className="relative">
                  <select 
                    value={leadForm.product}
                    onChange={e => setLeadForm({...leadForm, product: e.target.value as ProductType})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none transition-all"
                    disabled={isSubmitting}
                  >
                    {Object.values(ProductType).map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>

               {/* Status Field - Only show when editing or Admin */}
               {(editingLeadId || isAdmin) && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                     <ListTodo size={16} className="text-emerald-600"/> 
                     Statut du dossier
                  </label>
                  <div className="relative">
                    <select 
                      value={leadForm.status}
                      onChange={e => setLeadForm({...leadForm, status: e.target.value as LeadStatus})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none appearance-none transition-all"
                      disabled={isSubmitting}
                    >
                      {Object.values(LeadStatus).map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
               )}
              
              <div className="pt-2 flex gap-3">
                {editingLeadId && (
                  <button 
                    type="button"
                    onClick={handleDeleteLead}
                    disabled={isSubmitting}
                    className="p-3.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center border border-red-100"
                    title="Supprimer ce dossier"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> {isAdmin ? 'Sauvegarde...' : 'Envoi en cours...'}
                    </>
                  ) : (
                    editingLeadId ? 'Mettre à jour' : (isAdmin ? 'Ajouter à la base' : 'Valider et Transmettre')
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
