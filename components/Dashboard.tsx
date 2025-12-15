import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, Users, Wallet, FileText, Plus, TrendingUp, CheckCircle2, 
  Clock, Phone, Search, LogOut, Bell, Pencil, Loader2, X, Shield, Network, 
  ListTodo, ArrowLeft, ArrowRight, Trash2, PieChart as PieChartIcon,
  Menu, ChevronRight, Calendar, Mail, Check
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  AreaChart, Area, PieChart, Pie, Legend
} from 'recharts';
import { Lead, LeadStatus, ProductType, COMMISSION_RATES, User, AppNotification } from '../types';

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

// DONNÉES DE DÉMONSTRATION MISES À JOUR (Tableaux de produits)
const MOCK_LEADS: Lead[] = [
  { id: '1', partnerId: 'local-user', partnerName: 'Vous', name: 'Jean Dupont', phone: '06 12 34 56 78', email: 'jean.dupont@email.com', products: [ProductType.SOLAR], status: LeadStatus.INSTALLED, dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), estimatedCommission: 850 },
  { id: '2', partnerId: 'local-user', partnerName: 'Vous', name: 'Sophie Martin', phone: '07 98 76 54 32', email: 'smartin@test.fr', products: [ProductType.HEAT_PUMP, ProductType.ISOLATION], status: LeadStatus.MEETING, dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(), estimatedCommission: 1050 },
  { id: '3', partnerId: 'local-user', partnerName: 'Vous', name: 'Marc Voisin', phone: '06 00 11 22 33', email: '', products: [ProductType.ISOLATION], status: LeadStatus.NEW, dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), estimatedCommission: 500 },
  { id: '4', partnerId: 'other', partnerName: 'Alice Durand', name: 'Paul Bricole', phone: '06 55 44 33 22', email: 'paul@brico.fr', products: [ProductType.HEAT_PUMP], status: LeadStatus.QUOTE, dateAdded: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(), estimatedCommission: 150 },
];

const MOCK_NOTIFICATIONS: AppNotification[] = [
    { id: 'n1', userId: 'local-user', leadId: '1', title: 'Commission validée', message: 'Votre dossier Jean Dupont a été installé avec succès.', date: new Date().toISOString(), isRead: false, type: 'INFO' },
    { id: 'n2', userId: 'local-user', leadId: '2', title: 'RDV Confirmé', message: 'Le technicien passera chez Sophie Martin le 24/10.', date: new Date(Date.now() - 86400000).toISOString(), isRead: true, type: 'STATUS_CHANGE' }
];

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const isAdmin = user.role === 'ADMIN';
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'partners'>('overview');
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  
  // --- LOCAL DATA STATE ---
  const [allLeads, setAllLeads] = useState<Lead[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  
  // INIT DATA (Local Storage or Mock)
  useEffect(() => {
    // Leads
    const savedLeads = localStorage.getItem('ecoparrain_leads');
    if (savedLeads) {
        try {
            const parsed = JSON.parse(savedLeads);
            // MIGRATION DE DONNÉES : Si l'ancien format 'product' existe, on le convertit en 'products[]'
            const migratedLeads = parsed.map((l: any) => {
                if (!l.products && l.product) {
                    return { ...l, products: [l.product] }; // Conversion ancien -> nouveau
                }
                return l;
            });
            setAllLeads(migratedLeads);
        } catch (e) {
            console.error("Erreur parsing leads", e);
            setAllLeads([]);
        }
    } else {
        const initialLeads = isAdmin ? MOCK_LEADS : MOCK_LEADS.filter(l => l.partnerId === 'local-user' || l.partnerId === user.id);
        const personalizedLeads = initialLeads.map(l => l.partnerId === 'local-user' ? {...l, partnerId: user.id} : l);
        setAllLeads(personalizedLeads);
        localStorage.setItem('ecoparrain_leads', JSON.stringify(personalizedLeads));
    }

    // Notifications
    const savedNotifs = localStorage.getItem('ecoparrain_notifs');
    if (savedNotifs) {
        setNotifications(JSON.parse(savedNotifs));
    } else {
        setNotifications(MOCK_NOTIFICATIONS);
        localStorage.setItem('ecoparrain_notifs', JSON.stringify(MOCK_NOTIFICATIONS));
    }
  }, [user.id, isAdmin]);

  // Save to LocalStorage
  useEffect(() => {
    if (allLeads.length > 0) localStorage.setItem('ecoparrain_leads', JSON.stringify(allLeads));
  }, [allLeads]);

  useEffect(() => {
    if (notifications.length > 0) localStorage.setItem('ecoparrain_notifs', JSON.stringify(notifications));
  }, [notifications]);


  // --- UI STATES ---
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

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
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('ecoparrain_notifs');
  };

  const displayedLeads = isAdmin 
    ? allLeads 
    : allLeads.filter(l => l.partnerId === user.id);

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
    if (new Date(lead.dateAdded) > new Date(partner.lastActive)) {
        partner.lastActive = lead.dateAdded;
    }
    return acc;
  }, []) : [];

  const [showModal, setShowModal] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  
  // State pour le formulaire (support multi-produits)
  const [leadForm, setLeadForm] = useState<{
    name: string;
    phone: string;
    email: string;
    products: ProductType[];
    status: LeadStatus;
  }>({
    name: '',
    phone: '',
    email: '',
    products: [ProductType.SOLAR],
    status: LeadStatus.NEW
  });

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const totalCommission = displayedLeads
    .filter(l => l.status === LeadStatus.PAID || l.status === LeadStatus.INSTALLED)
    .reduce((acc, curr) => acc + curr.estimatedCommission, 0);
  
  const pendingCommission = displayedLeads
    .filter(l => l.status !== LeadStatus.PAID && l.status !== LeadStatus.INSTALLED && l.status !== LeadStatus.NEW)
    .reduce((acc, curr) => acc + curr.estimatedCommission, 0);

  const totalLeads = displayedLeads.length;

  const calculateAnalytics = (leads: Lead[]) => {
    const monthlyDataMap = new Map<string, number>();
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
    months.forEach((m) => monthlyDataMap.set(m, 0));

    leads.forEach(lead => {
      const date = new Date(lead.dateAdded);
      if (lead.status !== LeadStatus.NEW) {
        const monthIndex = date.getMonth();
        const monthName = months[monthIndex];
        const currentVal = monthlyDataMap.get(monthName) || 0;
        monthlyDataMap.set(monthName, currentVal + lead.estimatedCommission);
      }
    });

    const evolutionData = Array.from(monthlyDataMap).map(([name, value]) => ({ name, value }));
    const productCountMap = new Map<string, number>();
    
    // Itération sur les tableaux de produits
    leads.forEach(lead => {
       lead.products.forEach(p => {
           const current = productCountMap.get(p) || 0;
           productCountMap.set(p, current + 1);
       });
    });

    const COLORS = ['#0ea5e9', '#06b6d4', '#14b8a6', '#f59e0b', '#ef4444'];
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

  const { evolutionData, productData } = calculateAnalytics(displayedLeads);

  const handleOpenAddModal = () => {
    setEditingLeadId(null);
    setLeadForm({ name: '', phone: '', email: '', products: [ProductType.SOLAR], status: LeadStatus.NEW });
    setShowModal(true);
  };

  const handleOpenEditModal = (lead: Lead) => {
    setEditingLeadId(lead.id);
    setLeadForm({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      products: lead.products,
      status: lead.status
    });
    setShowModal(true);
  };

  const toggleProductSelection = (product: ProductType) => {
      const currentProducts = leadForm.products;
      if (currentProducts.includes(product)) {
          // On ne peut pas désélectionner le dernier produit
          if (currentProducts.length > 1) {
              setLeadForm({ ...leadForm, products: currentProducts.filter(p => p !== product) });
          }
      } else {
          setLeadForm({ ...leadForm, products: [...currentProducts, product] });
      }
  };

  const handleDeleteLead = async () => {
    if (!editingLeadId) return;

    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce dossier ?")) {
      const updated = allLeads.filter(l => l.id !== editingLeadId);
      setAllLeads(updated);
      setNotification({ message: 'Dossier supprimé.', type: 'success' });
      setShowModal(false);
      setEditingLeadId(null);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
        // Calcul de la commission totale estimée pour tous les produits sélectionnés
        let totalEstCommission = 0;
        leadForm.products.forEach(p => {
            const rate = COMMISSION_RATES.find(r => r.product === p);
            if (rate) {
                totalEstCommission += (rate.min + rate.max) / 2;
            }
        });

        if (editingLeadId) {
            const updatedLeads = allLeads.map(l => {
                if (l.id === editingLeadId) {
                    return {
                        ...l,
                        name: leadForm.name,
                        phone: leadForm.phone,
                        email: leadForm.email,
                        products: leadForm.products,
                        status: leadForm.status,
                        estimatedCommission: totalEstCommission
                    };
                }
                return l;
            });
            setAllLeads(updatedLeads);
            setNotification({ message: 'Dossier mis à jour.', type: 'success' });
        } else {
            const newLead: Lead = {
                id: Math.random().toString(36).substr(2, 9),
                partnerId: user.id,
                partnerName: user.name,
                name: leadForm.name,
                phone: leadForm.phone,
                email: leadForm.email,
                products: leadForm.products,
                status: LeadStatus.NEW,
                dateAdded: new Date().toISOString(),
                estimatedCommission: totalEstCommission
            };
            setAllLeads([newLead, ...allLeads]);
            setNotification({ message: 'Dossier ajouté.', type: 'success' });
            setActiveTab('leads');
        }

        setShowModal(false);
        setLeadForm({ name: '', phone: '', email: '', products: [ProductType.SOLAR], status: LeadStatus.NEW });
        setEditingLeadId(null);
        setIsSubmitting(false);
    }, 500);
  };

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-slate-100 text-slate-700';
      case LeadStatus.CONTACTED: return 'bg-sky-100 text-sky-700';
      case LeadStatus.MEETING: return 'bg-cyan-100 text-cyan-700';
      case LeadStatus.QUOTE: return 'bg-purple-100 text-purple-700';
      case LeadStatus.SIGNED: return 'bg-green-100 text-green-700';
      case LeadStatus.INSTALLED: return 'bg-green-100 text-green-800 border border-green-200';
      case LeadStatus.PAID: return 'bg-green-100 text-green-800 font-bold';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Helper pour afficher les produits proprement
  const renderProductBadges = (products: ProductType[]) => {
      if (!products || products.length === 0) return <span className="text-slate-400 italic">Aucun</span>;
      
      // Si trop de produits (mobile), on affiche un compteur
      if (products.length > 2) {
          return (
              <div className="flex gap-1">
                  <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-medium text-xs border border-slate-200 whitespace-nowrap">
                    {products[0]}
                  </span>
                  <span className="px-2 py-1 bg-sky-50 rounded text-sky-600 font-bold text-xs border border-sky-100 whitespace-nowrap">
                    +{products.length - 1} autre(s)
                  </span>
              </div>
          );
      }
      
      return (
          <div className="flex flex-wrap gap-1">
              {products.map(p => (
                 <span key={p} className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-medium text-xs border border-slate-200 whitespace-nowrap">
                    {p}
                 </span>
              ))}
          </div>
      );
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 pb-20 md:pb-0">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 left-4 right-4 md:top-auto md:left-auto md:bottom-6 md:right-6 z-[80] animate-fade-in-up">
          <div className="bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-700">
            <div className={`${notification.type === 'error' ? 'bg-red-500' : 'bg-sky-500'} rounded-full p-1`}>
              <CheckCircle2 size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">{notification.type === 'error' ? 'Erreur' : 'Succès'}</p>
              <p className="text-xs text-slate-300">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="ml-4 text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Sidebar (Desktop Only) */}
      <aside className={`w-72 text-white hidden md:flex flex-col fixed h-full z-20 shadow-xl bg-slate-900`}>
        <div className="p-8 border-b border-white/10">
          <h1 className="text-2xl font-bold tracking-tight">EcoParrain<span className="text-sky-500">.</span></h1>
          <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider font-semibold flex items-center gap-1">
             {isAdmin ? <><Shield size={12} className="text-sky-400"/> Espace Siège</> : 'Espace Partenaire'}
          </p>
        </div>
        
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-4 mt-4">Pilotage</div>
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === 'overview' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard size={20} /> Vue d'ensemble
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === 'leads' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Users size={20} /> {isAdmin ? 'Tous les Dossiers' : 'Mes Filleuls'}
            <span className="ml-auto bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full">{totalLeads}</span>
          </button>
          
          {isAdmin && (
             <button 
                onClick={() => { setActiveTab('partners'); setSelectedPartnerId(null); }}
                className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === 'partners' ? 'bg-sky-600 text-white shadow-lg shadow-sky-900/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
              >
                <Network size={20} /> Réseau Partenaires
              </button>
          )}
        </nav>

        <div className="p-4 border-t border-white/10">
           <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-xs bg-sky-500`}>
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
      <main className="flex-1 md:ml-72 p-4 md:p-8 overflow-y-auto max-w-[1600px] min-h-screen">
        
        {/* Top Header Mobile (Compact) */}
        <div className="md:hidden mb-6 flex justify-between items-center bg-white p-3 px-4 rounded-xl shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold bg-sky-600`}>
               EP
            </div>
            <h1 className="text-base font-bold text-slate-900 tracking-tight">EcoParrain</h1>
          </div>
          
          <div className="flex items-center gap-2" ref={notificationRef}>
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 relative text-slate-500 hover:text-sky-600 transition-colors"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                )}
            </button>
            <button 
                onClick={onLogout}
                className="p-2 text-slate-400"
            >
                <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Notifications Dropdown */}
         {showNotifications && (
            <div className="fixed top-16 right-4 w-[calc(100vw-2rem)] md:absolute md:top-14 md:right-0 md:w-96 bg-white rounded-xl shadow-xl border border-slate-200 z-[60] animate-fade-in-up overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">Notifications</h3>
                    {notifications.length > 0 && (
                        <button onClick={handleClearAllNotifications} className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1">
                            <Trash2 size={12} /> Tout effacer
                        </button>
                    )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                        notifications.map(notif => (
                            <div key={notif.id} onClick={() => handleMarkAsRead(notif.id)} className={`p-4 border-b border-slate-50 ${!notif.isRead ? 'bg-sky-50/50' : ''}`}>
                                <h4 className={`text-sm ${!notif.isRead ? 'font-bold' : 'font-medium'}`}>{notif.title}</h4>
                                <p className="text-xs text-slate-500 mt-1">{notif.message}</p>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-slate-400 text-sm">Aucune notification.</div>
                    )}
                </div>
            </div>
         )}


        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    {isAdmin && <Shield className="text-sky-600 w-6 h-6"/>}
                    Tableau de Bord
                </h2>
                <p className="text-slate-500 text-sm mt-1">
                    {isAdmin ? "Activité du réseau." : `Bon retour, ${user.name} !`}
                </p>
              </div>
              
              <div className="hidden md:flex gap-3 relative">
                 <button onClick={() => setShowNotifications(!showNotifications)} className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 relative">
                    <Bell size={20} />
                    {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-slate-50">{unreadCount}</span>}
                 </button>
                <button onClick={handleOpenAddModal} className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-sky-600/20">
                  <Plus size={20} /> {isAdmin ? 'Ajout Manuel' : 'Nouveau Prospect'}
                </button>
              </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-sky-50 text-sky-600 rounded-xl"><Wallet size={24} /></div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                </div>
                <p className="text-sm text-slate-500 font-medium mb-1">{isAdmin ? 'Volume d\'Affaires' : 'Commissions Gagnées'}</p>
                <h3 className="text-2xl font-bold text-slate-900">{totalCommission.toLocaleString()} €</h3>
              </div>
              
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                 <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-cyan-50 text-cyan-600 rounded-xl"><TrendingUp size={24} /></div>
                </div>
                <p className="text-sm text-slate-500 font-medium mb-1">{isAdmin ? 'Pipeline' : 'En attente'}</p>
                <h3 className="text-2xl font-bold text-slate-900">{pendingCommission.toLocaleString()} €</h3>
              </div>
              
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                 <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users size={24} /></div>
                </div>
                <p className="text-sm text-slate-500 font-medium mb-1">Total Dossiers</p>
                <h3 className="text-2xl font-bold text-slate-900">{totalLeads}</h3>
              </div>
            </div>

            {/* --- CHARTS (Responsive) - Masqué sur mobile pour simplification --- */}
            <div className="hidden md:grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-lg text-slate-900">Évolution</h3>
                </div>
                <div className="h-56 md:h-64 -ml-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={evolutionData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} tickFormatter={(value) => `${value}€`} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                   <h3 className="font-bold text-lg text-slate-900">Produits</h3>
                </div>
                <div className="h-56 md:h-64 w-full flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={productData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {productData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} stroke="none" />))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none' }} />
                      <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#475569' }}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recent Activity (Compact List) */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-lg text-slate-900 mb-4 flex items-center gap-2">
                  <Clock size={18} className="text-slate-400"/> Activité Récente
                </h3>
                <div className="space-y-3">
                  {displayedLeads.slice(0, 4).map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl" onClick={() => handleOpenEditModal(lead)}>
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${lead.status === LeadStatus.NEW ? 'bg-white border border-slate-200 text-slate-600' : 'bg-sky-100 text-sky-600'}`}>
                           {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-900 truncate max-w-[120px] md:max-w-xs">{lead.name}</p>
                          <div className="text-xs text-slate-500">
                             {renderProductBadges(lead.products)}
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                  ))}
                  {displayedLeads.length === 0 && <div className="text-center py-4 text-slate-400 text-sm">Rien à signaler.</div>}
                </div>
            </div>
          </div>
        )}
        
        {/* NEW TAB: Partners Network (Admin Only) */}
        {activeTab === 'partners' && isAdmin && (
            selectedPartnerId ? (
                // DETAIL VIEW OF A PARTNER
                <div className="space-y-6 animate-fade-in">
                    <header className="flex items-center gap-4">
                        <button onClick={() => setSelectedPartnerId(null)} className="p-2 bg-white border border-slate-200 rounded-full text-slate-500 shadow-sm">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">{partnersList.find(p => p.id === selectedPartnerId)?.name}</h2>
                        </div>
                    </header>

                    {/* Stats Cards Row */}
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        <div className="bg-sky-50 px-4 py-3 rounded-xl border border-sky-100 shrink-0 min-w-[120px]">
                            <p className="text-xs font-bold text-sky-800 uppercase">Dossiers</p>
                            <p className="text-xl font-bold text-sky-600">{partnersList.find(p => p.id === selectedPartnerId)?.leadCount || 0}</p>
                        </div>
                        <div className="bg-blue-50 px-4 py-3 rounded-xl border border-blue-100 shrink-0 min-w-[140px]">
                            <p className="text-xs font-bold text-blue-800 uppercase">Commissions</p>
                            <p className="text-xl font-bold text-blue-600">{partnersList.find(p => p.id === selectedPartnerId)?.totalCommission || 0} €</p>
                        </div>
                    </div>

                    {/* Mobile Card List for Partner Leads */}
                    <div className="space-y-3 md:hidden">
                       {allLeads.filter(l => l.partnerId === selectedPartnerId).map(lead => (
                            <div key={lead.id} onClick={() => handleOpenEditModal(lead)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-slate-900">{lead.name}</h4>
                                    <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full ${getStatusColor(lead.status)}`}>{lead.status}</span>
                                </div>
                                <div className="text-sm text-slate-500 mb-2 flex items-center gap-2">
                                    <Phone size={14}/> {lead.phone}
                                </div>
                                <div className="flex justify-between items-center text-xs border-t border-slate-50 pt-2 mt-2">
                                    <div className="flex-1">{renderProductBadges(lead.products)}</div>
                                    <span className="font-bold text-slate-900 ml-2">{lead.estimatedCommission} €</span>
                                </div>
                            </div>
                       ))}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                                        <th className="p-5 font-semibold">Prospect</th>
                                        <th className="p-5 font-semibold">Coordonnées</th>
                                        <th className="p-5 font-semibold">Projets</th>
                                        <th className="p-5 font-semibold">Statut</th>
                                        <th className="p-5 font-semibold text-right">Comm.</th>
                                        <th className="p-5 font-semibold w-16"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {allLeads.filter(l => l.partnerId === selectedPartnerId).map((lead) => (
                                        <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="p-5 font-semibold text-slate-900">{lead.name}</td>
                                            <td className="p-5 text-sm text-slate-600">{lead.phone}</td>
                                            <td className="p-5 text-sm">{renderProductBadges(lead.products)}</td>
                                            <td className="p-5"><span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(lead.status)}`}>{lead.status}</span></td>
                                            <td className="p-5 text-right font-bold">{lead.estimatedCommission} €</td>
                                            <td className="p-5"><button onClick={() => handleOpenEditModal(lead)} className="p-2 text-slate-400 hover:text-sky-600"><Pencil size={16} /></button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                // LIST VIEW OF PARTNERS
                <div className="space-y-6 animate-fade-in">
                    <header>
                        <h2 className="text-2xl font-bold text-slate-900">Réseau</h2>
                    </header>

                    {/* Mobile Card View for Partners */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {partnersList.map(partner => (
                            <div key={partner.id} onClick={() => setSelectedPartnerId(partner.id)} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between active:scale-[0.98] transition-transform">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                                        {partner.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">{partner.name}</h4>
                                        <p className="text-xs text-slate-500">{partner.leadCount} dossiers</p>
                                    </div>
                                </div>
                                <ChevronRight className="text-slate-300" size={20} />
                            </div>
                        ))}
                         {partnersList.length === 0 && <div className="text-center text-slate-500 py-8">Aucun partenaire.</div>}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="p-5 font-semibold">Partenaire</th>
                            <th className="p-5 font-semibold text-center">Dossiers</th>
                            <th className="p-5 font-semibold text-right">Gains</th>
                            <th className="p-5 font-semibold w-10"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {partnersList.map((partner) => (
                                <tr key={partner.id} className="hover:bg-slate-50/80 cursor-pointer" onClick={() => setSelectedPartnerId(partner.id)}>
                                    <td className="p-5 font-semibold text-slate-900">{partner.name}</td>
                                    <td className="p-5 text-center">{partner.leadCount}</td>
                                    <td className="p-5 text-right font-bold">{partner.totalCommission} €</td>
                                    <td className="p-5 text-slate-300"><ArrowRight size={20} /></td>
                                </tr>
                            ))}
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
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">{isAdmin ? 'Dossiers' : 'Mes Filleuls'}</h2>
                <button onClick={handleOpenAddModal} className="md:hidden bg-sky-600 text-white p-2 rounded-lg shadow-sm">
                   <Plus size={24} />
                </button>
              </div>
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                 <input type="text" placeholder="Rechercher un nom..." className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm w-full md:w-64 focus:ring-2 focus:ring-sky-500 outline-none" />
              </div>
            </header>
            
            {/* MOBILE CARD VIEW (Optimized for Mobile) */}
            <div className="md:hidden space-y-4">
               {displayedLeads.map(lead => (
                 <div key={lead.id} onClick={() => handleOpenEditModal(lead)} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-[0.99] transition-transform">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                                {lead.name.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-base">{lead.name}</h4>
                                <div className="flex items-center gap-1 text-xs text-slate-500">
                                    <Calendar size={12}/> {new Date(lead.dateAdded).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(lead.status)}`}>
                           {lead.status}
                        </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mt-3 pt-3 border-t border-slate-50">
                        <div className="bg-slate-50 rounded-lg p-2 text-center">
                            <span className="block text-xs text-slate-400 uppercase font-bold">Projets</span>
                            <div className="font-medium text-slate-700 mt-1">
                                {renderProductBadges(lead.products)}
                            </div>
                        </div>
                        <div className="bg-sky-50 rounded-lg p-2 text-center">
                            <span className="block text-xs text-sky-800 uppercase font-bold">Gain Est.</span>
                            <span className="font-bold text-sky-600 text-base">{lead.estimatedCommission} €</span>
                        </div>
                    </div>
                 </div>
               ))}
               {displayedLeads.length === 0 && (
                   <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                       <Users size={48} className="mb-4 opacity-20"/>
                       <p>Aucun dossier pour le moment.</p>
                   </div>
               )}
            </div>

            {/* DESKTOP TABLE VIEW */}
            <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-5 font-semibold">Prospect</th>
                      {isAdmin && <th className="p-5 font-semibold text-sky-700">Apporteur</th>}
                      <th className="p-5 font-semibold">Coordonnées</th>
                      <th className="p-5 font-semibold">Projets</th>
                      <th className="p-5 font-semibold">Statut</th>
                      <th className="p-5 font-semibold text-right">Comm.</th>
                      <th className="p-5 font-semibold w-16"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {displayedLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors group">
                        <td className="p-5">
                          <div className="font-semibold text-slate-900">{lead.name}</div>
                          <div className="text-xs text-slate-400">#{lead.id.slice(0, 4)}</div>
                        </td>
                        {isAdmin && <td className="p-5 text-sm text-slate-600">{lead.partnerName || 'Inconnu'}</td>}
                        <td className="p-5 text-sm text-slate-600">
                          <div className="flex flex-col gap-1">
                            <span className="flex items-center gap-2"><Phone size={12} className="text-slate-400"/> {lead.phone}</span>
                            <span className="text-xs text-slate-400 flex items-center gap-2">{lead.email}</span>
                          </div>
                        </td>
                        <td className="p-5 text-sm">{renderProductBadges(lead.products)}</td>
                        <td className="p-5"><span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(lead.status)}`}>{lead.status}</span></td>
                        <td className="p-5 text-right font-bold text-slate-900">{lead.estimatedCommission} €</td>
                        <td className="p-5"><button onClick={() => handleOpenEditModal(lead)} className="p-2 text-slate-400 hover:text-sky-600"><Pencil size={16} /></button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-between items-center z-40 pb-safe shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
         <button 
           onClick={() => setActiveTab('overview')}
           className={`flex flex-col items-center gap-1 p-2 rounded-xl w-16 transition-all ${activeTab === 'overview' ? 'text-sky-600 font-medium' : 'text-slate-400'}`}
         >
            <LayoutDashboard size={24} strokeWidth={activeTab === 'overview' ? 2.5 : 2} />
            <span className="text-[10px]">Accueil</span>
         </button>

         <button 
           onClick={() => setActiveTab('leads')}
           className={`flex flex-col items-center gap-1 p-2 rounded-xl w-16 transition-all ${activeTab === 'leads' ? 'text-sky-600 font-medium' : 'text-slate-400'}`}
         >
            <Users size={24} strokeWidth={activeTab === 'leads' ? 2.5 : 2} />
            <span className="text-[10px]">Dossiers</span>
         </button>
         
         {/* Central Floating Action Button Style */}
         <div className="relative -top-5">
            <button 
                onClick={handleOpenAddModal}
                className="w-14 h-14 bg-gradient-to-tr from-sky-500 to-cyan-400 rounded-full flex items-center justify-center text-white shadow-lg shadow-sky-500/40 active:scale-95 transition-transform border-4 border-slate-50"
            >
                <Plus size={28} strokeWidth={3} />
            </button>
         </div>

         {isAdmin && (
            <button 
                onClick={() => setActiveTab('partners')}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl w-16 transition-all ${activeTab === 'partners' ? 'text-sky-600 font-medium' : 'text-slate-400'}`}
            >
                <Network size={24} strokeWidth={activeTab === 'partners' ? 2.5 : 2} />
                <span className="text-[10px]">Réseau</span>
            </button>
         )}

         {!isAdmin && (
            <button 
                onClick={() => document.getElementById('simulateur')?.scrollIntoView()}
                className="flex flex-col items-center gap-1 p-2 rounded-xl w-16 text-slate-400"
            >
                <PieChartIcon size={24} />
                <span className="text-[10px]">Stats</span>
            </button>
         )}

         {/* Placeholder for Profile/More if needed, currently using Admin toggle logic to balance layout */}
          <button 
             className="flex flex-col items-center gap-1 p-2 rounded-xl w-16 text-slate-400"
             onClick={onLogout} // Quick logout for mobile demo
          >
              <LogOut size={24} />
              <span className="text-[10px]">Sortir</span>
          </button>
      </div>

      {/* Add/Edit Lead Modal - FULL SCREEN ON MOBILE */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center sm:p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setShowModal(false)}></div>
          
          <div className="relative bg-white w-full h-full md:h-auto md:max-w-lg md:rounded-2xl shadow-2xl overflow-hidden animate-scale-up flex flex-col">
            
            {/* Modal Header */}
            <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur sticky top-0 z-10">
              <div>
                 <h3 className="text-lg md:text-xl font-bold text-slate-900">
                   {editingLeadId ? 'Modifier' : 'Nouveau Dossier'}
                 </h3>
                 <p className="text-xs text-slate-500">
                   {editingLeadId ? 'Mise à jour des informations' : 'Remplissez les détails du prospect'}
                 </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 bg-slate-200/50 rounded-full text-slate-500 hover:text-slate-900 transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 bg-white pb-24 md:pb-8">
              <form id="leadForm" onSubmit={handleLeadSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nom du prospect <span className="text-red-500">*</span></label>
                  <input 
                    required
                    type="text" 
                    value={leadForm.name}
                    onChange={e => setLeadForm({...leadForm, name: e.target.value})}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-base"
                    placeholder="Ex: Pierre Durand"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Téléphone <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            required
                            type="tel"
                            value={leadForm.phone}
                            onChange={e => setLeadForm({...leadForm, phone: e.target.value})}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-base"
                            placeholder="06 12 34 56 78"
                        />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="email"
                            value={leadForm.email}
                            onChange={e => setLeadForm({...leadForm, email: e.target.value})}
                            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-base"
                            placeholder="email@exemple.com"
                        />
                    </div>
                  </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-3">Produits intéressés <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 gap-3">
                        {[ProductType.SOLAR, ProductType.HEAT_PUMP, ProductType.ISOLATION, ProductType.WATER_HEATER].map((product) => (
                            <button
                                key={product}
                                type="button"
                                onClick={() => toggleProductSelection(product)}
                                className={`p-3 rounded-xl border text-sm font-medium flex items-center justify-between transition-all ${
                                    leadForm.products.includes(product)
                                        ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-sm' 
                                        : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                                }`}
                            >
                                {product}
                                {leadForm.products.includes(product) && <Check size={16} className="text-sky-600" />}
                            </button>
                        ))}
                    </div>
                </div>

                {editingLeadId && (
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Statut du dossier</label>
                        <select 
                            value={leadForm.status}
                            onChange={(e) => setLeadForm({...leadForm, status: e.target.value as LeadStatus})}
                            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-base appearance-none"
                        >
                            {Object.values(LeadStatus).map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                    </div>
                )}
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-4 md:p-6 border-t border-slate-100 bg-slate-50 flex justify-between items-center sticky bottom-0 z-10">
                {editingLeadId ? (
                    <button 
                        type="button" 
                        onClick={handleDeleteLead}
                        className="text-red-500 hover:text-red-700 font-medium px-4 py-2 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 text-sm"
                    >
                        <Trash2 size={18} /> <span className="hidden sm:inline">Supprimer</span>
                    </button>
                ) : <div></div>}
                
                <div className="flex gap-3">
                    <button 
                        type="button" 
                        onClick={() => setShowModal(false)}
                        className="px-5 py-2.5 text-slate-500 font-bold hover:bg-slate-200/50 rounded-xl transition-colors"
                    >
                        Annuler
                    </button>
                    <button 
                        form="leadForm"
                        type="submit" 
                        disabled={isSubmitting}
                        className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold shadow-lg shadow-sky-600/20 transition-all flex items-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <><Check size={20}/> Enregistrer</>}
                    </button>
                </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;