import { useEffect, useState } from 'react';
import { useDebtStore } from '../store';
import { Transaction } from '../types';
import { ArrowLeft, Plus, Check, Calendar, ArrowUpRight, ArrowDownLeft, ChevronRight, Edit3 } from 'lucide-react';
import EditTransactionModal from './EditTransactionModal';
import AddTransactionModal from './AddTransactionModal';
import { motion, AnimatePresence } from 'motion/react';

export default function DebtorDetailScreen() {
  const activeDebtorName = useDebtStore(state => state.activeDebtorName);
  const closeHistory = useDebtStore(state => state.closeHistory);
  const loadHistory = useDebtStore(state => state.loadHistory);
  const history = useDebtStore(state => state.history);
  const isLoadingHistory = useDebtStore(state => state.isLoadingHistory);
  const debtors = useDebtStore(state => state.debtors);
  const markFullyPaid = useDebtStore(state => state.markFullyPaid);
  const isLoadingStore = useDebtStore(state => state.isLoading);

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);

  // Active debtor info from main debtors array
  const debtorInfo = debtors.find(
    d => d.name.toLowerCase() === activeDebtorName?.toLowerCase()
  );

  // Re-fetch history when details screen renders or when transactions mutate
  useEffect(() => {
    if (activeDebtorName) {
      loadHistory(activeDebtorName);
    }
  }, [activeDebtorName, loadHistory]);

  if (!activeDebtorName) return null;

  // Calculate chronological running balances
  let runningTotal = 0;
  const historyWithRunningBalance = [...history].map(tx => {
    if (tx.type === 'BORROW') {
      runningTotal += tx.amount;
    } else {
      runningTotal -= tx.amount;
    }
    return {
      ...tx,
      runningBalance: Number(runningTotal.toFixed(2))
    };
  });

  // Reverse list for UI display (most recent transactions at the top) or keep chronologically sorted?
  // Standard financial ledger display is chronological (to trace the running balance naturally from top to bottom)
  // Let's render chronologically so the running balance logic flows naturally from first to latest transaction!
  
  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString.split('T')[0];
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
    } catch {
      return isoString;
    }
  };

  const currentOutstanding = debtorInfo ? debtorInfo.balance : 0;

  return (
    <div id="debtor-detail-screen" className="flex flex-col min-h-screen bg-slate-50">
      {/* Header Bar */}
      <div id="detail-header" className="sticky top-0 z-20 bg-white border-b border-slate-100 px-4 py-4 flex items-center justify-between shadow-sm">
        <button
          id="btn-detail-back"
          onClick={closeHistory}
          className="p-1 px-2.5 -ml-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        
        <h2 id="detail-title" className="font-display font-extrabold text-slate-800 text-sm">
          Account Status
        </h2>

        <div className="w-12" /> {/* spacer balance */}
      </div>

      {/* Main Stats Core */}
      <div className="p-4 flex flex-col items-center justify-center bg-white border-b border-slate-100 text-center py-8 space-y-3">
        <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-display font-medium text-lg shadow-inner">
          {activeDebtorName.charAt(0).toUpperCase()}
        </div>

        <div>
          <h1 id="detail-person-name" className="font-display font-bold text-slate-800 text-lg">
            {activeDebtorName}
          </h1>
          <p id="detail-status-pill" className="text-[10px] mt-1 font-mono">
            {currentOutstanding > 0 ? (
              <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 font-bold tracking-wide">
                UNPAID LEDGER
              </span>
            ) : (
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 font-bold tracking-wide">
                FULLY PAID
              </span>
            )}
          </p>
        </div>

        {/* Big Balance displays */}
        <div className="pt-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block font-sans">
            Outstanding Balance
          </span>
          <span id="detail-big-balance" className="font-mono text-3xl font-extrabold text-slate-800 tracking-tight block mt-1">
            {currentOutstanding.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
          </span>
        </div>

        {/* Action button row */}
        {currentOutstanding > 0 && (
          <div className="flex gap-2.5 pt-4 w-full max-w-xs justify-center">
            <button
              id="detail-action-pay"
              onClick={() => setIsAddPaymentOpen(true)}
              className="px-4 py-2.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-sm transition-all flex items-center justify-center gap-1 bg-clip-border"
            >
              <Plus className="w-3.5 h-3.5" />
              Pay Balance
            </button>
            <button
              id="detail-action-markpaid"
              onClick={() => markFullyPaid(activeDebtorName)}
              disabled={isLoadingStore}
              className="px-4 py-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              {isLoadingStore ? 'Settling...' : 'Mark Fully Paid'}
            </button>
          </div>
        )}
      </div>

      {/* Transaction History Section */}
      <div className="p-4 flex-grow w-full max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider font-sans">
            Ledger Entries
          </h3>
          <span className="text-[11px] text-slate-500 font-medium">
            {history.length} {history.length === 1 ? 'record' : 'records'}
          </span>
        </div>

        {/* Loading History state */}
        {isLoadingHistory ? (
          <div id="history-loading-pulse" className="space-y-3 pt-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white p-4 rounded-xl border border-slate-100 animate-pulse space-y-2">
                <div className="h-4 bg-slate-100 rounded w-1/3" />
                <div className="h-3 bg-slate-100 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : history.length === 0 ? (
          <div id="history-empty-state" className="bg-white rounded-xl p-8 text-center border border-slate-150 py-12 space-y-2">
            <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-xs font-bold text-slate-700">No Transactions Recorded</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-[200px] mx-auto">
              This person currently has no registered balance sheet activities.
            </p>
          </div>
        ) : (
          /* Actual Ledger Table List */
          <div id="tx-history-list" className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-100">
              {historyWithRunningBalance.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => {
                    setSelectedTx(tx);
                    setIsEditOpen(true);
                  }}
                  className="p-4 hover:bg-slate-55/70 cursor-pointer active:bg-slate-50 transition-colors flex items-center justify-between text-xs"
                >
                  <div className="flex items-start gap-3">
                    {/* Icon indicator */}
                    <div className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center ${
                      tx.type === 'BORROW' 
                        ? 'bg-rose-50 text-rose-600' 
                        : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {tx.type === 'BORROW' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <ArrowDownLeft className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5 flex-wrap">
                        {tx.type === 'BORROW' ? 'Lent (BORROW)' : 'Received (PAYMENT)'}
                        <span className="p-0.5 hover:bg-slate-100 rounded text-slate-400 transition-colors border-0">
                          <Edit3 className="w-3 h-3 inline" />
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                        <Calendar className="w-2.5 h-2.5" />
                        {formatDate(tx.createdAt)}
                      </div>
                      {tx.note && (
                        <div className="text-[10px] text-slate-500 mt-1 italic line-clamp-1">
                          {tx.note}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing Balance right aligned */}
                  <div className="text-right flex flex-col justify-end">
                    <span className={`font-mono font-bold leading-normal ${
                      tx.type === 'BORROW' ? 'text-rose-600' : 'text-emerald-600'
                    }`}>
                      {tx.type === 'BORROW' ? '+' : '-'}{tx.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-medium block leading-none mt-0.5">
                      Bal: {tx.runningBalance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit transaction modal overlay triggers */}
      {selectedTx && (
        <EditTransactionModal
          isOpen={isEditOpen}
          transaction={selectedTx}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedTx(null);
          }}
        />
      )}

      {/* Trigger Add payment directly prefilled */}
      <AddTransactionModal
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        initialType="PAYMENT"
        initialName={activeDebtorName}
      />
    </div>
  );
}
