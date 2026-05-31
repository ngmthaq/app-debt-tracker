import { useEffect, useState } from 'react';
import { useDebtStore } from './store';
import {
  Plus,
  Search,
  RotateCw,
  SlidersHorizontal,
  Users,
  CheckCircle,
  AlertCircle,
  Database,
  Settings,
  HelpCircle,
  TrendingUp,
  UserCheck,
  ChevronRight,
  HandCoins,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  FileSpreadsheet,
  Terminal
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

// Subcomponents
import StatusToast from './components/StatusToast';
import SetupGuideModal from './components/SetupGuideModal';
import AddTransactionModal from './components/AddTransactionModal';
import DebtorDetailScreen from './components/DebtorDetailScreen';

export default function App() {
  const initStore = useDebtStore(state => state.initStore);
  const loadAllData = useDebtStore(state => state.loadAllData);
  const debtors = useDebtStore(state => state.debtors);
  const isLoading = useDebtStore(state => state.isLoading);
  const settings = useDebtStore(state => state.settings);
  const activeDebtorName = useDebtStore(state => state.activeDebtorName);
  const markFullyPaid = useDebtStore(state => state.markFullyPaid);
  const loadHistory = useDebtStore(state => state.loadHistory);
  const getStats = useDebtStore(state => state.getStats);

  // Modal open states
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addModalType, setAddModalType] = useState<'BORROW' | 'PAYMENT'>('BORROW');
  const [addModalPrefilledName, setAddModalPrefilledName] = useState('');

  // Filtering / Searching states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'UNPAID' | 'PAID'>('ALL');

  // Trigger store boot
  useEffect(() => {
    initStore();
  }, [initStore]);

  // Derived dashboard stats
  const stats = getStats();

  // Helper trigger to open Add Modal prefilled
  const openAddModal = (mode: 'BORROW' | 'PAYMENT', prefilledName = '') => {
    setAddModalType(mode);
    setAddModalPrefilledName(prefilledName);
    setIsAddOpen(true);
  };

  // Human friendly relative datetime format
  const formatLastActivity = (isoString: string) => {
    try {
      const date = new Date(isoString);
      if (isNaN(date.getTime())) return isoString.split('T')[0];
      
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return isoString;
    }
  };

  // Filter and sort debtors active list
  const filteredDebtors = debtors
    .filter(d => {
      // 1. Search Query filter (name matching case-insensitive)
      const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
      
      // 2. Filter tabs
      if (activeFilter === 'UNPAID') return matchesSearch && d.balance > 0;
      if (activeFilter === 'PAID') return matchesSearch && d.balance <= 0;
      return matchesSearch;
    })
    .sort((a, b) => {
      // Priority sorting as requested:
      // 1st: Highest outstanding balance first
      if (b.balance !== a.balance) {
        return b.balance - a.balance;
      }
      // 2nd: Most recently updated date second
      return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
    });

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center text-slate-800 font-sans selection:bg-indigo-100 select-none">
      
      {/* Constraints container simulating standalone app boundaries centered gracefully on ultra wide desktop */}
      <div id="app-container" className="w-full max-w-md bg-slate-50 min-h-screen shadow-2xl relative flex flex-col no-scrollbar">
        
        {/* Render Details Screen overlay if selected */}
        <AnimatePresence mode="wait">
          {activeDebtorName ? (
            <motion.div
              key="detail-screen"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute inset-0 z-40 bg-slate-50 flex flex-col"
            >
              <DebtorDetailScreen />
            </motion.div>
          ) : (
            <motion.div
              key="main-dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col flex-grow pb-24"
            >
              
              {/* Top Banner App Branding */}
              <header id="dashboard-header" className="bg-slate-900 text-white px-5 pt-6 pb-20 rounded-b-[2rem] shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />

                {/* Brand Line */}
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                      <HandCoins className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h1 id="app-brand-name" className="font-display font-black text-sm tracking-tight text-white leading-none">
                        LEDGER
                      </h1>
                      <span className="text-[9px] font-mono font-semibold tracking-widest text-indigo-300 uppercase block mt-0.5">
                        Mobile Ledger
                      </span>
                    </div>
                  </div>

                  {/* Actions Right */}
                  <div className="flex items-center gap-2">
                    <button
                      id="btn-sync-reload"
                      onClick={() => loadAllData()}
                      disabled={isLoading}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                      title="Sync spreadsheet values"
                    >
                      <RotateCw id="icon-reload" className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                      id="btn-settings-setup"
                      onClick={() => setIsSetupOpen(true)}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-all active:scale-95 flex items-center gap-1 text-[11px] font-medium"
                      title="Storage configurations"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Configs</span>
                    </button>
                  </div>
                </div>

                {/* Connection Indicator Banner */}
                <div
                  id="connection-indicator-card"
                  onClick={() => setIsSetupOpen(true)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 select-none cursor-pointer group transition-all mt-4 relative z-10"
                >
                  <div className="flex items-center gap-2.5">
                    {settings.useLocalFallback || !settings.scriptUrl ? (
                      <>
                        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse mt-0.5" />
                        <div>
                          <span className="text-xs font-bold text-slate-100 flex items-center gap-1">
                            Demo Cash Ledger Mode
                          </span>
                          <p className="text-[10px] text-indigo-200 mt-0.5 leading-none">
                            Saved locally. Click to sync to Google Sheet
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-2 h-2 rounded-full bg-emerald-400 mt-0.5" />
                        <div className="max-w-[200px] overflow-hidden">
                          <span className="text-xs font-bold text-slate-100 flex items-center gap-1">
                            Sheets Live Connected
                          </span>
                          <p className="text-[10px] text-slate-300 mt-0.5 no-scrollbar overflow-x-auto whitespace-nowrap font-mono">
                            {settings.scriptUrl.substring(0, 30)}...
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                </div>
              </header>

              {/* KPI Summary Cards Grid - Overlap layout floating above header */}
              <section id="kpi-scorecard" className="mx-4 -mt-14 mb-6 relative z-30 select-none">
                <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 space-y-4">
                  {/* Big Total card */}
                  <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-xl text-white">
                    <div>
                      <span className="text-[10px] font-bold text-indigo-300 tracking-wider uppercase block">
                        Total Outstanding Debt
                      </span>
                      <span id="amount-total-outstanding" className="font-mono text-2xl font-extrabold tracking-tight mt-1 block">
                        {stats.totalOutstandingAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                      </span>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Smaller sub cards */}
                  <div className="grid grid-cols-3 gap-2.5">
                    <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                      <span id="label-debtor-count" className="font-mono text-base font-extrabold text-slate-800 tracking-tight block">
                        {stats.totalDebtors}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mt-1">
                        Active debtors
                      </span>
                    </div>
                    
                    <div className="p-2.5 bg-rose-50/50 border border-rose-100/50 rounded-xl text-center">
                      <span id="label-unpaid-count" className="font-mono text-base font-extrabold text-rose-600 tracking-tight block">
                        {stats.unpaidDebtors}
                      </span>
                      <span className="text-[9px] font-bold text-rose-450 uppercase tracking-wide block mt-1">
                        Unpaid debts
                      </span>
                    </div>

                    <div className="p-2.5 bg-emerald-50/50 border border-emerald-100/50 rounded-xl text-center">
                      <span id="label-paid-count" className="font-mono text-base font-extrabold text-emerald-600 tracking-tight block">
                        {stats.fullyPaidDebtors}
                      </span>
                      <span className="text-[9px] font-bold text-emerald-450 uppercase tracking-wide block mt-1">
                        Fully Settled
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* Filtering and search core UI */}
              <section id="debts-listing-filters" className="px-4 space-y-3">
                
                {/* Search Bar */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </span>
                  {searchQuery && (
                    <button
                      id="btn-clear-search"
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 active:scale-90"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <input
                    id="input-search-debtor"
                    type="text"
                    placeholder="Search debtor by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 text-xs text-slate-800 bg-white border border-slate-200 rounded-xl shadow-inner focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                  />
                </div>

                {/* Filter tabs */}
                <div className="flex border-b border-slate-200">
                  <button
                    id="filter-all"
                    onClick={() => setActiveFilter('ALL')}
                    className={`pb-2.5 px-4 text-xs font-bold tracking-wide transition-all border-b-2 ${
                      activeFilter === 'ALL'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    All Accounts
                  </button>
                  <button
                    id="filter-unpaid"
                    onClick={() => setActiveFilter('UNPAID')}
                    className={`pb-2.5 px-4 text-xs font-bold tracking-wide transition-all border-b-2 flex items-center gap-1 ${
                      activeFilter === 'UNPAID'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Unpaid
                    {stats.unpaidDebtors > 0 && (
                      <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center font-mono">
                        {stats.unpaidDebtors}
                      </span>
                    )}
                  </button>
                  <button
                    id="filter-paid"
                    onClick={() => setActiveFilter('PAID')}
                    className={`pb-2.5 px-4 text-xs font-bold tracking-wide transition-all border-b-2 ${
                      activeFilter === 'PAID'
                        ? 'border-indigo-600 text-indigo-600'
                        : 'border-transparent text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Fully Paid
                  </button>
                </div>
              </section>

              {/* Debtors list container */}
              <main id="debtors-active-list" className="px-4 mt-4 space-y-3.5 flex-grow">
                {isLoading ? (
                  <div id="debts-loading-placeholder" className="space-y-3">
                    {[1, 2, 3].map(item => (
                      <div key={item} className="h-28 bg-white border border-slate-100 rounded-2xl p-4 animate-pulse space-y-3">
                        <div className="flex justify-between">
                          <div className="h-4 bg-slate-100 rounded w-1/3" />
                          <div className="h-4 bg-slate-100 rounded w-1/4" />
                        </div>
                        <div className="h-3 bg-slate-100 rounded w-1/2" />
                        <div className="h-8 bg-slate-50 rounded" />
                      </div>
                    ))}
                  </div>
                ) : filteredDebtors.length === 0 ? (
                  <div id="debts-empty-view" className="bg-white rounded-2xl border border-slate-200 p-8 text-center py-12 space-y-2">
                    <SlidersHorizontal className="w-8 h-8 text-slate-300 mx-auto" />
                    <h4 className="text-xs font-bold text-slate-700">No Matching Debts found</h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed max-w-[200px] mx-auto">
                      Adjust your search query or filters to look up balance sheet ledger entries.
                    </p>
                  </div>
                ) : (
                  /* Debtor Item Cards */
                  filteredDebtors.map((debtor) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow transition-all text-xs"
                      key={debtor.name}
                    >
                      {/* Top row - details click trigger */}
                      <div
                        id={`debtor-card-header-${debtor.name.replace(/\s+/g, '-')}`}
                        onClick={() => loadHistory(debtor.name)}
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50/50 active:bg-slate-50 transition-all select-none"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-display font-semibold text-slate-700">
                            {debtor.name.charAt(0).toUpperCase()}
                          </div>
                          
                          <div className="space-y-0.5">
                            <h3 className="font-display font-medium text-slate-800 text-[12.5px] line-clamp-1 pr-2">
                              {debtor.name}
                            </h3>
                            <p className="text-[10px] text-slate-400 flex items-center gap-1 font-medium select-none">
                              <span>Last active:</span>
                              <span className="text-slate-600 font-semibold">
                                {formatLastActivity(debtor.lastUpdated)}
                              </span>
                            </p>
                          </div>
                        </div>

                        {/* Balance side display */}
                        <div className="text-right flex items-center gap-2 select-none">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                              Balance
                            </span>
                            <span className="font-mono font-black text-[13px] text-slate-800 mt-1 leading-none">
                              {debtor.balance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </span>
                            <span className="mt-1 block">
                              {debtor.balance > 0 ? (
                                <span className="text-[9px] font-mono tracking-wider font-bold text-rose-500 uppercase">
                                  Unpaid
                                </span>
                              ) : (
                                <span className="text-[9px] font-mono tracking-wider font-bold text-emerald-500 uppercase">
                                  Paid
                                </span>
                              )}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>
                      </div>

                      {/* Sticky action row below card */}
                      {debtor.balance > 0 && (
                        <div id={`debtor-card-actions-${debtor.name.replace(/\s+/g, '-')}`} className="flex border-t border-slate-100 bg-slate-50/40 p-2 gap-2">
                          <button
                            onClick={() => openAddModal('PAYMENT', debtor.name)}
                            className="flex-1 py-2 text-[11px] font-bold text-emerald-700 hover:bg-emerald-50 bg-white border border-emerald-100 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1"
                          >
                            <HandCoins className="w-3.5 h-3.5" />
                            Record Payment
                          </button>
                          
                          <button
                            onClick={() => markFullyPaid(debtor.name)}
                            disabled={isLoading}
                            className="flex-1 py-2 text-[11px] font-bold text-slate-700 hover:bg-slate-100 bg-white border border-slate-150 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1 disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-slate-400" />
                            {isLoading ? 'Processing...' : 'Mark Fully Paid'}
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))
                )}
              </main>

              {/* Floating sticky add buttons for standard mobile targets */}
              <div className="fixed bottom-6 right-4 left-4 max-w-sm mx-auto flex gap-3 z-30 select-none">
                <button
                  id="btn-sticky-add"
                  onClick={() => openAddModal('BORROW')}
                  className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-3.5 rounded-2xl shadow-xl shadow-indigo-600/30 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Lend Money (Add Debt)
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

        {/* Global modals rendering stack */}
        <SetupGuideModal
          isOpen={isSetupOpen}
          onClose={() => setIsSetupOpen(false)}
        />

        <AddTransactionModal
          isOpen={isAddOpen}
          onClose={() => setIsAddOpen(false)}
          initialType={addModalType}
          initialName={addModalPrefilledName}
        />

        {/* Dynamic status feedback toast cards */}
        <StatusToast />

      </div>
    </div>
  );
}
