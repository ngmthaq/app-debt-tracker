import { create } from 'zustand';
import { Transaction, Debtor, DashboardStats, ConnectionSettings } from './types';
import { api } from './api';

// Initial pre-populated transactions for a premium "out of the box" demo experience
const INITIAL_DEMO_TRANSACTIONS: Transaction[] = [
  {
    id: 'demo-1',
    name: 'John Doe',
    amount: 100,
    type: 'BORROW',
    createdAt: '2026-05-01T10:00:00.000Z',
  },
  {
    id: 'demo-2',
    name: 'John Doe',
    amount: 50,
    type: 'BORROW',
    createdAt: '2026-05-02T14:30:00.000Z',
  },
  {
    id: 'demo-3',
    name: 'John Doe',
    amount: 30,
    type: 'PAYMENT',
    createdAt: '2026-05-03T09:15:00.000Z',
  },
  {
    id: 'demo-4',
    name: 'Mary Watson',
    amount: 250,
    type: 'BORROW',
    createdAt: '2026-05-24T16:45:00.000Z',
  },
  {
    id: 'demo-5',
    name: 'David Miller',
    amount: 150,
    type: 'BORROW',
    createdAt: '2026-05-27T11:00:00.000Z',
  },
  {
    id: 'demo-6',
    name: 'David Miller',
    amount: 150,
    type: 'PAYMENT',
    createdAt: '2026-05-29T17:20:00.000Z',
  },
  {
    id: 'demo-7',
    name: 'Sophia Chen',
    amount: 450,
    type: 'BORROW',
    createdAt: '2026-05-28T08:00:00.000Z',
  },
  {
    id: 'demo-8',
    name: 'Sophia Chen',
    amount: 150,
    type: 'PAYMENT',
    createdAt: '2026-05-30T15:10:00.000Z',
  },
];

interface DebtTrackerState {
  // Config
  settings: ConnectionSettings;

  // Data State
  debtors: Debtor[];
  namesList: string[]; // For Auto-complete
  history: Transaction[]; // Transaction history of active debtor
  activeDebtorName: string | null; // Name of currently viewed debtor

  // UX State
  isLoading: boolean;
  isLoadingHistory: boolean;
  error: string | null;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;

  // Actions
  initStore: () => void;
  loadAllData: () => Promise<void>;
  loadHistory: (name: string) => Promise<void>;
  closeHistory: () => void;
  updateSettings: (scriptUrl: string, useLocalFallback: boolean) => Promise<void>;

  addDebt: (name: string, amount: number, note?: string) => Promise<void>;
  addPayment: (name: string, amount: number, note?: string) => Promise<void>;
  markFullyPaid: (name: string) => Promise<void>;
  editTransaction: (
    id: string,
    name: string,
    amount: number,
    type: 'BORROW' | 'PAYMENT',
    note?: string
  ) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  // Import/Export helpers
  syncLocalToSheets: () => Promise<void>;
  clearNotification: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;

  // Derived state computed dynamically
  getStats: () => DashboardStats;
}

export const useDebtStore = create<DebtTrackerState>((set, get) => {
  // Helper to load transactions from localStorage
  const getLocalTransactions = (): Transaction[] => {
    const raw = localStorage.getItem('debt_tracker_local_transactions');
    if (!raw) {
      localStorage.setItem(
        'debt_tracker_local_transactions',
        JSON.stringify(INITIAL_DEMO_TRANSACTIONS)
      );
      return INITIAL_DEMO_TRANSACTIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DEMO_TRANSACTIONS;
    }
  };

  // Helper to save transactions to localStorage
  const saveLocalTransactions = (txs: Transaction[]) => {
    localStorage.setItem('debt_tracker_local_transactions', JSON.stringify(txs));
  };

  // Helper to aggregate debtors list from local transactions
  const computeDebtorsFromLocal = (txs: Transaction[]): Debtor[] => {
    const map: Record<
      string,
      { name: string; borrows: number; payments: number; lastUpdated: string }
    > = {};

    txs.forEach((t) => {
      const name = t.name.trim();
      if (!name) return;
      const key = name.toLowerCase();

      if (!map[key]) {
        map[key] = {
          name: name, // Preserve actual casing of first appearance
          borrows: 0,
          payments: 0,
          lastUpdated: t.createdAt,
        };
      }

      if (t.type === 'BORROW') {
        map[key].borrows += t.amount;
      } else if (t.type === 'PAYMENT') {
        map[key].payments += t.amount;
      }

      // Compute latest updated
      if (new Date(t.createdAt) > new Date(map[key].lastUpdated)) {
        map[key].lastUpdated = t.createdAt;
      }
    });

    return Object.values(map).map((d) => {
      const balance = Number((d.borrows - d.payments).toFixed(2));
      return {
        name: d.name,
        balance,
        lastUpdated: d.lastUpdated,
        status: balance > 0 ? 'UNPAID' : 'PAID',
      };
    });
  };

  return {
    // ----------------------------------------------------
    // INITIAL STATES
    // ----------------------------------------------------
    settings: {
      scriptUrl: localStorage.getItem('debt_tracker_script_url') || '',
      useLocalFallback: localStorage.getItem('debt_tracker_use_local') !== 'false',
    },
    debtors: [],
    namesList: [],
    history: [],
    activeDebtorName: null,
    isLoading: false,
    isLoadingHistory: false,
    error: null,
    notification: null,

    // ----------------------------------------------------
    // CORE INITIALIZATION
    // ----------------------------------------------------
    initStore: () => {
      // Run on app boot
      get().loadAllData();
    },

    // ----------------------------------------------------
    // DATA FETCHING ACTIONS
    // ----------------------------------------------------
    loadAllData: async () => {
      const { settings } = get();
      set({ isLoading: true, error: null });

      // Local fallback mode
      if (settings.useLocalFallback || !settings.scriptUrl) {
        try {
          const localTxs = getLocalTransactions();
          const debtors = computeDebtorsFromLocal(localTxs);

          // Compute unique names list for autocomplete
          const uniqueNames = Array.from(new Set(localTxs.map((t) => t.name.trim()))).filter(
            Boolean
          );

          // Simulate brief natural delay for visual feedback
          await new Promise((resolve) => setTimeout(resolve, 400));

          set({
            debtors,
            namesList: uniqueNames,
            isLoading: false,
          });
        } catch (err: any) {
          set({
            error: `Failed to load local data: ${err.message}`,
            isLoading: false,
          });
        }
        return;
      }

      // Sheets mode
      try {
        const [debtors, namesList] = await Promise.all([
          api.getDebts(settings.scriptUrl),
          api.getNames(settings.scriptUrl),
        ]);

        set({
          debtors,
          namesList,
          isLoading: false,
        });
      } catch (err: any) {
        set({
          error: err.message,
          isLoading: false,
          // Fall back gracefully to local so the UI doesn't crash
          notification: {
            message: `Sheets connection failed. Displaying local cache. Error: ${err.message}`,
            type: 'error',
          },
        });

        // Load local ledger as safe fallback
        const localTxs = getLocalTransactions();
        const debtors = computeDebtorsFromLocal(localTxs);
        const uniqueNames = Array.from(new Set(localTxs.map((t) => t.name.trim()))).filter(Boolean);
        set({ debtors, namesList: uniqueNames });
      }
    },

    loadHistory: async (nameToLoad: string) => {
      const { settings } = get();
      set({ activeDebtorName: nameToLoad, isLoadingHistory: true, history: [] });

      if (settings.useLocalFallback || !settings.scriptUrl) {
        try {
          const localTxs = getLocalTransactions();
          // Filter matching ignoring casing
          const debtorHistory = localTxs
            .filter((t) => t.name.trim().toLowerCase() === nameToLoad.toLowerCase().trim())
            .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

          await new Promise((resolve) => setTimeout(resolve, 300));
          set({
            history: debtorHistory,
            isLoadingHistory: false,
          });
        } catch (err: any) {
          set({
            error: `Failed to load history: ${err.message}`,
            isLoadingHistory: false,
          });
        }
        return;
      }

      // Sheets mode
      try {
        const payload = await api.getHistory(settings.scriptUrl, nameToLoad);
        // Map GAS response to Client Transaction
        const debtorHistory: Transaction[] = payload.map((item: any) => ({
          id: item.id || Math.random().toString(),
          name: nameToLoad,
          amount: Number(item.amount),
          note: item.note || '',
          type: item.type as 'BORROW' | 'PAYMENT',
          createdAt: item.createdAt,
        }));

        set({
          history: debtorHistory,
          isLoadingHistory: false,
        });
      } catch (err: any) {
        set({
          error: `Unable to sync history: ${err.message}`,
          isLoadingHistory: false,
          notification: { message: `Unable to load details: ${err.message}`, type: 'error' },
        });
      }
    },

    closeHistory: () => {
      set({ activeDebtorName: null, history: [] });
    },

    // ----------------------------------------------------
    // CONFIGURATION ACTIONS
    // ----------------------------------------------------
    updateSettings: async (scriptUrl: string, useLocalFallback: boolean) => {
      localStorage.setItem('debt_tracker_script_url', scriptUrl);
      localStorage.setItem('debt_tracker_use_local', useLocalFallback ? 'true' : 'false');

      set({
        settings: { scriptUrl, useLocalFallback },
        activeDebtorName: null, // Reset active history details during mode change
      });

      get().showToast(
        useLocalFallback
          ? 'Switched to Local Offline Ledger Mode'
          : 'Connecting to Google Sheets Backend...',
        'info'
      );

      await get().loadAllData();
    },

    // ----------------------------------------------------
    // BORROW TRANSACTION (LEND MONEY)
    // ----------------------------------------------------
    addDebt: async (name: string, amount: number, note?: string) => {
      if (!name.trim()) throw new Error('Person name is required');
      if (amount <= 0) throw new Error('Amount must be a positive number');

      const { settings } = get();
      set({ isLoading: true });

      if (settings.useLocalFallback || !settings.scriptUrl) {
        try {
          const localTxs = getLocalTransactions();
          const newTx: Transaction = {
            id: 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            name: name.trim(),
            amount,
            note: note || '',
            type: 'BORROW',
            createdAt: new Date().toISOString(),
          };

          const updated = [newTx, ...localTxs];
          saveLocalTransactions(updated);

          await get().loadAllData();
          get().showToast(
            `Recorded Borrows of ${amount.toLocaleString('vi-VN')} ₫ to ${name}`,
            'success'
          );
        } catch (err: any) {
          set({ isLoading: false, error: err.message });
        }
        return;
      }

      // Sheets mode
      try {
        await api.addDebt(settings.scriptUrl, name.trim(), amount, note);
        get().showToast(
          `Saved to Sheets: Lent ${amount.toLocaleString('vi-VN')} ₫ to ${name}`,
          'success'
        );
        await get().loadAllData();

        // Refresh details screen if viewing this debtor
        if (get().activeDebtorName?.toLowerCase() === name.toLowerCase()) {
          get().loadHistory(get().activeDebtorName!);
        }
      } catch (err: any) {
        set({ isLoading: false });
        get().showToast(
          `Error saving to Sheet: ${err.message}. Transaction logged in local cache instead.`,
          'error'
        );
        // Optimistic Save on failure so data isn't lost: Save locally
        const localTxs = getLocalTransactions();
        const newTx: Transaction = {
          id: 'local-err-' + Date.now(),
          name: name.trim(),
          amount,
          note: note || '',
          type: 'BORROW',
          createdAt: new Date().toISOString(),
        };
        saveLocalTransactions([newTx, ...localTxs]);
        await get().loadAllData();
      }
    },

    // ----------------------------------------------------
    // PAYMENT TRANSACTION (RECEIVE MONEY)
    // ----------------------------------------------------
    addPayment: async (name: string, amount: number, note?: string) => {
      if (!name.trim()) throw new Error('Person name is required');
      if (amount <= 0) throw new Error('Amount must be positive');

      const { settings } = get();
      set({ isLoading: true });

      if (settings.useLocalFallback || !settings.scriptUrl) {
        try {
          const localTxs = getLocalTransactions();
          const newTx: Transaction = {
            id: 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
            name: name.trim(),
            amount,
            note: note || '',
            type: 'PAYMENT',
            createdAt: new Date().toISOString(),
          };

          const updated = [newTx, ...localTxs];
          saveLocalTransactions(updated);

          await get().loadAllData();
          get().showToast(
            `Recorded Payment of ${amount.toLocaleString('vi-VN')} ₫ from ${name}`,
            'success'
          );
        } catch (err: any) {
          set({ isLoading: false, error: err.message });
        }
        return;
      }

      // Sheets mode
      try {
        await api.addPayment(settings.scriptUrl, name.trim(), amount, note);
        get().showToast(
          `Saved to Sheets: Received ${amount.toLocaleString('vi-VN')} ₫ from ${name}`,
          'success'
        );
        await get().loadAllData();

        // Refresh details screen if viewing this debtor
        if (get().activeDebtorName?.toLowerCase() === name.toLowerCase()) {
          get().loadHistory(get().activeDebtorName!);
        }
      } catch (err: any) {
        set({ isLoading: false });
        get().showToast(`Error saving to Sheet: ${err.message}. Added locally.`, 'error');
        const localTxs = getLocalTransactions();
        const newTx: Transaction = {
          id: 'local-err-' + Date.now(),
          name: name.trim(),
          amount,
          note: note || '',
          type: 'PAYMENT',
          createdAt: new Date().toISOString(),
        };
        saveLocalTransactions([newTx, ...localTxs]);
        await get().loadAllData();
      }
    },

    // ----------------------------------------------------
    // MARK AS FULLY PAID
    // ----------------------------------------------------
    markFullyPaid: async (name: string) => {
      // Find current balance for this debtor
      const debtor = get().debtors.find((d) => d.name.toLowerCase() === name.toLowerCase());
      if (!debtor || debtor.balance <= 0) {
        get().showToast(`${name} has no outstanding balance to pay.`, 'info');
        return;
      }

      const balanceToPay = debtor.balance;
      set({ isLoading: true });
      get().showToast(
        `Paying off outstanding balance of ${balanceToPay.toLocaleString('vi-VN')} ₫...`,
        'info'
      );

      await get().addPayment(name, balanceToPay);
    },

    // ----------------------------------------------------
    // EDIT AN EXISTING TRANSACTION
    // ----------------------------------------------------
    editTransaction: async (
      id: string,
      name: string,
      amount: number,
      type: 'BORROW' | 'PAYMENT',
      note?: string
    ) => {
      if (!name.trim()) throw new Error('Name cannot be empty');
      if (amount <= 0) throw new Error('Amount must be positive');

      const { settings, activeDebtorName } = get();
      set({ isLoading: true });

      // Local editing
      if (
        settings.useLocalFallback ||
        !settings.scriptUrl ||
        id.startsWith('local-') ||
        id.startsWith('demo-')
      ) {
        try {
          const localTxs = getLocalTransactions();
          const targetIndex = localTxs.findIndex((t) => t.id === id);
          if (targetIndex === -1) throw new Error('Transaction not found in cache');

          localTxs[targetIndex] = {
            ...localTxs[targetIndex],
            name: name.trim(),
            amount,
            note: note || '',
            type,
          };

          saveLocalTransactions(localTxs);
          get().showToast('Updated local transaction details', 'success');

          await get().loadAllData();
          if (activeDebtorName) {
            await get().loadHistory(activeDebtorName);
          }
        } catch (err: any) {
          set({ isLoading: false });
          get().showToast(`Failed to update locally: ${err.message}`, 'error');
        }
        return;
      }

      // Sheets Mode
      try {
        await api.editTransaction(settings.scriptUrl, id, name.trim(), amount, type, note);
        get().showToast('Transaction updated successfully in Sheets', 'success');

        await get().loadAllData();
        if (activeDebtorName) {
          await get().loadHistory(activeDebtorName);
        }
      } catch (err: any) {
        set({ isLoading: false });
        get().showToast(`Failed to update on Google Sheets: ${err.message}`, 'error');
      }
    },

    // ----------------------------------------------------
    // DELETE AN EXISTING TRANSACTION
    // ----------------------------------------------------
    deleteTransaction: async (id: string) => {
      const { settings, activeDebtorName } = get();
      set({ isLoading: true });

      // Local deletion
      if (
        settings.useLocalFallback ||
        !settings.scriptUrl ||
        id.startsWith('local-') ||
        id.startsWith('demo-')
      ) {
        try {
          const localTxs = getLocalTransactions();
          const filtered = localTxs.filter((t) => t.id !== id);
          saveLocalTransactions(filtered);

          get().showToast('Deleted transaction from local database', 'success');

          await get().loadAllData();
          if (activeDebtorName) {
            await get().loadHistory(activeDebtorName);
          }
        } catch (err: any) {
          set({ isLoading: false });
          get().showToast(`Failed to delete locally: ${err.message}`, 'error');
        }
        return;
      }

      // Sheets Mode
      try {
        await api.deleteTransaction(settings.scriptUrl, id);
        get().showToast('Transaction deleted successfully from Sheets', 'success');

        await get().loadAllData();
        if (activeDebtorName) {
          await get().loadHistory(activeDebtorName);
        }
      } catch (err: any) {
        set({ isLoading: false });
        get().showToast(`Failed to delete from Google Sheets: ${err.message}`, 'error');
      }
    },

    // ----------------------------------------------------
    // COPY LOCAL TRANSACTIONS TO SHEETS (MIGRATION SYNC)
    // ----------------------------------------------------
    syncLocalToSheets: async () => {
      const { settings } = get();
      if (!settings.scriptUrl) {
        get().showToast(
          'Configure a Google Apps Script Web App URL first to synchronize.',
          'error'
        );
        return;
      }

      set({ isLoading: true });
      get().showToast('Beginning full upload of local ledger cache to Google Sheet...', 'info');

      try {
        const localTxs = getLocalTransactions();
        let successCount = 0;
        let failCount = 0;

        for (const t of localTxs) {
          try {
            if (t.type === 'BORROW') {
              await api.addDebt(settings.scriptUrl, t.name, t.amount);
            } else {
              await api.addPayment(settings.scriptUrl, t.name, t.amount);
            }
            successCount++;
          } catch {
            failCount++;
          }
        }

        if (successCount > 0) {
          get().showToast(
            `Successfully uploaded ${successCount} transactions to Google Sheet!`,
            'success'
          );
          // Clear demo/local logs to prevent duplicate uploads next time
          localStorage.setItem('debt_tracker_local_transactions', JSON.stringify([]));
          // Switch local mode off as Sheets is primary now
          await get().updateSettings(settings.scriptUrl, false);
        } else {
          get().showToast('Upload failed. Please check CORS configs or Apps Script URL.', 'error');
          set({ isLoading: false });
        }
      } catch (err: any) {
        get().showToast(`Migration error: ${err.message}`, 'error');
        set({ isLoading: false });
      }
    },

    // ----------------------------------------------------
    // TOASTS & NOTIFICATIONS UTILS
    // ----------------------------------------------------
    showToast: (message: string, type: 'success' | 'error' | 'info') => {
      set({ notification: { message, type } });
    },

    clearNotification: () => {
      set({ notification: null });
    },

    // ----------------------------------------------------
    // DYNAMIC DERIVED DASHBOARD STATS
    // ----------------------------------------------------
    getStats: () => {
      const { debtors } = get();

      let totalOutstandingAmount = 0;
      let unpaidDebtors = 0;
      let fullyPaidDebtors = 0;

      debtors.forEach((d) => {
        if (d.balance > 0) {
          totalOutstandingAmount += d.balance;
          unpaidDebtors++;
        } else if (d.balance === 0) {
          // Debt exists previously but is now fully paid off
          fullyPaidDebtors++;
        }
      });

      return {
        totalOutstandingAmount: Number(totalOutstandingAmount.toFixed(2)),
        totalDebtors: debtors.length,
        unpaidDebtors,
        fullyPaidDebtors,
      };
    },
  };
});
