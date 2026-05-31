import { useState, useEffect, useRef, FormEvent } from 'react';
import { useDebtStore } from '../store';
import { Landmark, User, X, Check, ArrowDownLeft, ArrowUpRight, StickyNote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'BORROW' | 'PAYMENT';
  initialName?: string;
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  initialType = 'BORROW',
  initialName = ''
}: AddTransactionModalProps) {
  const addDebt = useDebtStore(state => state.addDebt);
  const addPayment = useDebtStore(state => state.addPayment);
  const namesList = useDebtStore(state => state.namesList);
  const isLoading = useDebtStore(state => state.isLoading);

  const [type, setType] = useState<'BORROW' | 'PAYMENT'>(initialType);
  const [name, setName] = useState(initialName);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Sync types and names if props change
  useEffect(() => {
    if (isOpen) {
      setType(initialType);
      setName(initialName);
      setAmount('');
      setNote('');
      setValidationError(null);
      setShowSuggestions(false);
    }
  }, [isOpen, initialType, initialName]);

  // Handle outside click to hide autocomplete list
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions when name input changes
  const handleNameChange = (val: string) => {
    setName(val);
    setValidationError(null);
    if (!val.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = namesList.filter(nameItem =>
      nameItem.toLowerCase().includes(val.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  };

  const handleSelectSuggestion = (suggestedName: string) => {
    setName(suggestedName);
    setShowSuggestions(false);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedName = name.trim();
    const parsedAmount = parseFloat(amount);

    if (!trimmedName) {
      setValidationError('Person name is required.');
      return;
    }

    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setValidationError('Please enter a valid positive number higher than 0.');
      return;
    }

    try {
      if (type === 'BORROW') {
        await addDebt(trimmedName, parsedAmount, note.trim());
      } else {
        await addPayment(trimmedName, parsedAmount, note.trim());
      }
      onClose();
    } catch (err: any) {
      setValidationError(err.message || 'Synchronization failure. Action aborted.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        id="add-tx-modal"
        className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="btn-close-mdl"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="mb-6">
          <h3 id="tx-modal-title" className="font-display text-lg font-bold text-slate-800">
            {type === 'BORROW' ? 'Lend Money (Borrow)' : 'Record Payment (Repayment)'}
          </h3>
          <p className="text-xs text-slate-500">Add a transaction to the balance sheet</p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          
          {/* Borrow vs Payment Selector Pill */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              id="selector-borrow"
              type="button"
              onClick={() => {
                setType('BORROW');
                setValidationError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                type === 'BORROW'
                  ? 'bg-white text-rose-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              Lend (Borrow)
            </button>
            <button
              id="selector-payment"
              type="button"
              onClick={() => {
                setType('PAYMENT');
                setValidationError(null);
              }}
              className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                type === 'PAYMENT'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" />
              Collect (Payment)
            </button>
          </div>

          {/* Person Name Input & Autocomplete */}
          <div className="space-y-1.5 relative" ref={autocompleteRef}>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Person's Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </span>
              <input
                id="input-tx-name"
                type="text"
                required
                autoComplete="off"
                placeholder="Enter person name..."
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  id="autocomplete-dropdown"
                  className="absolute z-35 left-0 right-0 top-[102%] mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-40 overflow-y-auto"
                >
                  {suggestions.map((s, index) => (
                    <button
                      key={s + index}
                      type="button"
                      onClick={() => handleSelectSuggestion(s)}
                      className="w-full text-left px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-between border-b border-slate-50 last:border-0"
                    >
                      <span>{s}</span>
                      <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider">Recent</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Amount Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Amount (₫)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-mono text-sm">
                ₫
              </span>
              <input
                id="input-tx-amount"
                type="number"
                step="any"
                required
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setValidationError(null);
                }}
                className="w-full pl-8 pr-4 py-3 text-xs text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono transition-all"
                style={{ contentVisibility: 'auto' }}
              />
            </div>
          </div>

          {/* Note Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Note <span className="text-slate-400 font-normal normal-case tracking-normal">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <StickyNote className="w-4 h-4" />
              </span>
              <input
                id="input-tx-note"
                type="text"
                placeholder="Add a memo or note..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs text-slate-800 bg-slate-50/50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {/* Validation Alert */}
          {validationError && (
            <div id="form-error-alert" className="p-3 text-[11px] text-rose-700 bg-rose-50 rounded-xl font-medium border border-rose-100">
              {validationError}
            </div>
          )}

          {/* Action Trigger */}
          <button
            id="btn-submit-tx"
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 h-11 text-xs font-semibold rounded-xl text-white shadow-md active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 ${
              type === 'BORROW' 
                ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-100' 
                : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100'
            } disabled:opacity-50`}
          >
            {isLoading ? (
              <span className="animate-pulse">Saving ledger...</span>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Confirm &amp; Record Transaction
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
