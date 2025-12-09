
import React, { useState } from 'react';
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
  Pencil
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Lead, LeadStatus, ProductType, COMMISSION_RATES, User } from '../types';
import AiCoach from './AiCoach';

// Mock Data
const INITIAL_LEADS: Lead[] = [
  { id: '1', name: 'Jean Dupont', phone: '06 12 34 56 78', email: 'jean.d@email.com', product: ProductType.SOLAR, status: LeadStatus.INSTALLED, dateAdded: '2023-10-15', estimatedCommission: 800 },
  { id: '2', name: 'Marie Curie', phone: '06 98 76 54 32', email: 'marie.c@email.com', product: ProductType.HEAT_PUMP, status: LeadStatus.SIGNED, dateAdded: '2023-11-02', estimatedCommission: 500 },
  { id: '3', name: 'Paul Martin', phone: '06 11 22 33 44', email: 'paul.m@email.com', product: ProductType.ISOLATION, status: LeadStatus.CONTACTED, dateAdded: '2023-11-10', estimatedCommission: 450 },
  { id: '4', name: 'Sophie Bernard', phone: '06 55 44 33 22', email: 'sophie.b@email.com', product: ProductType.SOLAR, status: LeadStatus.NEW, dateAdded: '2023-11-12', estimatedCommission: 1000 },
];

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'leads' | 'coach'>('overview');
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [showModal, setShowModal] = useState(false);
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    product: ProductType.SOLAR
  });

  // Derived Stats
  const totalCommission = leads
    .filter(l => l.status === LeadStatus.PAID || l.status === LeadStatus.INSTALLED)
    .reduce((acc, curr) => acc + curr.estimatedCommission, 0);
  
  const pendingCommission = leads
    .filter(l => l.status !== LeadStatus.PAID && l.status !== LeadStatus.INSTALLED && l.status !== LeadStatus.NEW)
    .reduce((acc, curr) => acc + curr.estimatedCommission, 0);

  const totalLeads = leads.length;

  const chartData = [
    { name: 'Nouveau', count: leads.filter(l => l.status === LeadStatus.NEW).length, color: '#94a3b8' },
    { name: 'En cours', count: leads.filter(l => [LeadStatus.CONTACTED, LeadStatus.MEETING, LeadStatus.QUOTE].includes(l.status)).length, color: '#3b82f6' },
    { name: 'Signé', count: leads.filter(l => l.status === LeadStatus.SIGNED).length, color: '#16a34a' },
    { name: 'Installé', count: leads.filter(l => l.status === LeadStatus.INSTALLED || l.status === LeadStatus.PAID).length, color: '#15803d' },
  ];

  const handleOpenAddModal = () => {
    setEditingLeadId(null);
    setLeadForm({ name: '', phone: '', email: '', product: ProductType.SOLAR });
    setShowModal(true);
  };

  const handleOpenEditModal = (lead: Lead) => {
    setEditingLeadId(lead.id);
    setLeadForm({
      name: lead.name,
      phone: lead.phone,
      email: lead.email,
      product: lead.product
    });
    setShowModal(true);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rate = COMMISSION_RATES.find(r => r.product === leadForm.product);
    const avgCommission = rate ? (rate.min + rate.max) / 2 : 0;

    if (editingLeadId) {
      // Update existing lead
      setLeads(leads.map(lead => 
        lead.id === editingLeadId 
          ? { 
              ...lead, 
              name: leadForm.name, 
              phone: leadForm.phone, 
              email: leadForm.email, 
              product: leadForm.product,
              estimatedCommission: avgCommission 
            } 
          : lead
      ));
    } else {
      // Create new lead
      const newLead: Lead = {
        id: Date.now().toString(),
        name: leadForm.name,
        phone: leadForm.phone,
        email: leadForm.email,
        product: leadForm.product,
        status: LeadStatus.NEW,
        dateAdded: new Date().toISOString().split('T')[0],
        estimatedCommission: avgCommission
      };
      setLeads([newLead, ...leads]);
    }

    setShowModal(false);
    setLeadForm({ name: '', phone: '', email: '', product: ProductType.SOLAR });
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
      {/* Sidebar */}
      <aside className="w-72 bg-slate-900 text-white hidden md:flex flex-col fixed h-full z-20 shadow-xl">
        <div className="p-8 border-b border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight">EcoParrain<span className="text-emerald-500">.</span></h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Espace Partenaire</p>
        </div>
        
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 px-4 mt-4">Menu Principal</div>
          <button 
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === 'overview' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={20} /> Vue d'ensemble
          </button>
          <button 
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === 'leads' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users size={20} /> Mes Filleuls
            <span className="ml-auto bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full">{leads.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('coach')}
            className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium ${activeTab === 'coach' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <CheckCircle2 size={20} /> Coach IA
            <span className="ml-auto bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold px-2 py-0.5 rounded-full text-black shadow-sm">PRO</span>
          </button>
          
          <div className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2 px-4 mt-8">Ressources</div>
          <button className="flex items-center gap-3 w-full px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors text-sm">
            <FileText size={20} /> Kit Marketing
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
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
      <main className="flex-1 md:ml-72 p-4 md:p-8 overflow-y-auto max-w-[1600px]">
        
        {/* Top Header Mobile */}
        <div className="md:hidden mb-6 flex justify-between items-center bg-white p-4 rounded-xl shadow-sm">
          <h1 className="text-xl font-bold text-slate-900">EcoParrain</h1>
          <div className="flex gap-2">
            <button onClick={handleOpenAddModal} className="p-2 bg-emerald-600 text-white rounded-lg">
              <Plus size={24} />
            </button>
             <button onClick={onLogout} className="p-2 bg-slate-100 text-slate-600 rounded-lg">
              <LogOut size={24} />
            </button>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Tableau de Bord</h2>
                <p className="text-slate-500 mt-1">Bon retour, {user.name} !</p>
              </div>
              <div className="flex gap-3">
                 <button className="p-2.5 bg-white border border-slate-200 text-slate-500 rounded-lg hover:bg-slate-50 transition-colors">
                    <Bell size={20} />
                 </button>
                <button 
                  onClick={handleOpenAddModal}
                  className="hidden md:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-all shadow-lg shadow-emerald-600/20"
                >
                  <Plus size={20} /> Nouveau Prospect
                </button>
              </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                    <Wallet size={24} />
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">+12%</span>
                </div>
                <p className="text-sm text-slate-500 font-medium mb-1">Commissions Gagnées</p>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{totalCommission.toLocaleString()} €</h3>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <TrendingUp size={24} />
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium mb-1">En cours de validation</p>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{pendingCommission.toLocaleString()} €</h3>
              </div>
              
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                 <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                    <Users size={24} />
                  </div>
                </div>
                <p className="text-sm text-slate-500 font-medium mb-1">Total Prospects</p>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{totalLeads}</h3>
              </div>
            </div>

            {/* Charts & Recent Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                  <BarChart size={18} className="text-slate-400"/>
                  Performance des dossiers
                </h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        cursor={{fill: '#f8fafc'}}
                      />
                      <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
                <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                  <Clock size={18} className="text-slate-400"/>
                  Activité Récente
                </h3>
                <div className="space-y-4 flex-1 overflow-auto pr-2">
                  {leads.slice(0, 4).map((lead) => (
                    <div key={lead.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-slate-100" onClick={() => handleOpenEditModal(lead)}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold ${lead.status === LeadStatus.NEW ? 'bg-slate-100 text-slate-600' : 'bg-green-100 text-green-600'}`}>
                           {lead.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-sm text-slate-900">{lead.name}</p>
                          <p className="text-xs text-slate-500">{lead.product}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveTab('leads')}
                  className="w-full mt-6 py-3 text-slate-600 text-sm font-medium hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors border border-dashed border-slate-200"
                >
                  Voir tous les prospects
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-6 animate-fade-in">
             <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Mes Filleuls</h2>
                <p className="text-slate-500 mt-1">Gérez vos recommandations et suivez leur avancement technique.</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Rechercher..." className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-64" />
                </div>
                <button 
                  onClick={handleOpenAddModal}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
                >
                  <Plus size={20} />
                </button>
              </div>
            </header>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
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
                    {leads.map((lead) => (
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
                  </tbody>
                </table>
              </div>
              {leads.length === 0 && (
                <div className="p-16 text-center text-slate-500 flex flex-col items-center">
                  <div className="bg-slate-50 p-4 rounded-full mb-4">
                    <Users size={32} className="text-slate-300"/>
                  </div>
                  <p className="text-lg font-medium text-slate-900">Aucun prospect</p>
                  <p className="text-sm">Commencez par ajouter votre premier filleul pour générer des revenus.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'coach' && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
             <header className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900">Coach Énergie IA</h2>
              <p className="text-slate-500 mt-2 text-lg">Votre assistant personnel disponible 24/7 pour vous aider à convaincre.</p>
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

      {/* Add/Edit Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-scale-up border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                 <h3 className="text-xl font-bold text-slate-900">
                   {editingLeadId ? 'Modifier le Prospect' : 'Nouveau Prospect'}
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
              
              <div className="pt-2 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3.5 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20"
                >
                  {editingLeadId ? 'Mettre à jour' : 'Valider le dossier'}
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
