import { useState, useEffect, FormEvent } from 'react';
import { useDebtStore } from '../store';
import { Transaction } from '../types';
import { Trash2, AlertCircle, Save, X, RotateCcw, StickyNote } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface EditTransactionModalProps {
  isOpen: boolean;
  transaction: Transaction | null;
  onClose: () => void;
}

export default function EditTransactionModal({ isOpen, transaction, onClose }: EditTransactionModalProps) {
  const editTransaction = useDebtStore(state => state.editTransaction);
  const deleteTransaction = useDebtStore(state => state.deleteTransaction);
  const isLoading = useDebtStore(state => state.isLoading);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState<'BORROW' | 'PAYMENT'>('BORROW');
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && transaction) {
      setName(transaction.name);
      setAmount(String(transaction.amount));
      setNote(transaction.note || '');
      setType(transaction.type);
      setIsConfirmingDelete(false);
      setError(null);
    }
  }, [isOpen, transaction]);

  if (!isOpen || !transaction) return null;

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (!name.trim()) {
      setError('Person name cannot be left empty.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please provide a valid transaction amount.');
      return;
    }

    try {
      await editTransaction(transaction.id, name.trim(), parsedAmount, type, note.trim());
      onClose();
    } catch (err: any) {
      setError(err.message || 'Saving failed.');
    }
  };

  const handleDelete = async () => {
    setError(null);
    try {
      await deleteTransaction(transaction.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Deletion failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        id="edit-tx-modal"
        className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
      >
        {/* Close */}
        <button
          id="btn-close-edit"
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h3 id="edit-modal-title" className="font-display text-lg font-bold text-slate-800">
            Edit Transaction
          </h3>
          <p className="text-xs text-slate-500">Modify properties of this ledger entry</p>
        </div>

        {/* If confirming delete, show nested UI */}
        <AnimatePresence mode="wait">
          {isConfirmingDelete ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              id="confirm-delete-panel"
              className="space-y-4"
            >
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 flex gap-3 text-rose-800">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wide">Confirm Deletion</h4>
                  <p className="text-xs mt-1 leading-relaxed text-rose-700 font-medium">
                    Are you sure you want to permanently delete this transaction? 
                    This will recalculate the debtor&apos;s outstanding balance and sync with Sheets. This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  id="btn-cancel-delete"
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs py-2.5 rounded-xl active:scale-95 transition-all text-center"
                >
                  No, Keep It
                </button>
                <button
                  id="btn-confirm-delete"
                  type="button"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs py-2.5 rounded-xl shadow-md active:scale-95 transition-all text-center disabled:opacity-50"
                >
                  {isLoading ? 'Deleting...' : 'Yes, Delete Permanently'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleSave}
              className="space-y-4"
            >
              {/* Type Toggle */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Transaction Category
                </label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 border border-slate-150 rounded-xl">
                  <button
                    id="edit-selector-borrow"
                    type="button"
                    onClick={() => setType('BORROW')}
                    className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      type === 'BORROW'
                        ? 'bg-white text-rose-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Lend (BORROW)
                  </button>
                  <button
                    id="edit-selector-payment"
                    type="button"
                    onClick={() => setType('PAYMENT')}
                    className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                      type === 'PAYMENT'
                        ? 'bg-white text-emerald-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Repay (PAYMENT)
                  </button>
                </div>
              </div>

              {/* Name field */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Name
                </label>
                <input
                  id="edit-input-name"
                  type="text"
                  required
                  placeholder="Person's name..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all font-semibold"
                />
              </div>

              {/* Amount field */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Amount (₫)
                </label>
                <input
                  id="edit-input-amount"
                  type="number"
                  step="any"
                  required
                  min="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-4 py-3 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-mono transition-all font-semibold"
                />
              </div>

              {/* Note field */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Note <span className="font-normal normal-case tracking-normal text-slate-400">(optional)</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <StickyNote className="w-4 h-4" />
                  </span>
                  <input
                    id="edit-input-note"
                    type="text"
                    placeholder="Add a memo or note..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>

              {error && (
                <div id="edit-error-alert" className="p-3 text-xs text-rose-700 bg-rose-50 rounded-xl font-medium border border-rose-100">
                  {error}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-4">
                {/* Delete button (triggering inline confirmation) */}
                <button
                  id="btn-trigger-delete"
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="px-4 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-100 rounded-xl flex items-center justify-center transition-all active:scale-95"
                  title="Delete Transaction"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                {/* Save button */}
                <button
                  id="btn-edit-save"
                  type="submit"
                  disabled={isLoading}
                  className="flex-grow bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs py-3 rounded-xl shadow-md shadow-indigo-100 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {isLoading ? (
                    'Saving changes...'
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
