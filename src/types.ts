export type TransactionType = 'BORROW' | 'PAYMENT';

export interface Transaction {
  id: string; // Unique transaction ID
  name: string; // Debtor/Person name
  amount: number; // Positive number
  type: TransactionType; // BORROW (lent) or PAYMENT (repay)
  createdAt: string; // ISO String or Format "YYYY-MM-DD" / "YYYY-MM-DD HH:mm:ss"
}

export interface Debtor {
  name: string;
  balance: number; // Outstanding balance (BORROW - PAYMENT)
  lastUpdated: string; // Date of last activity
  status: 'PAID' | 'UNPAID';
}

export interface DashboardStats {
  totalOutstandingAmount: number;
  totalDebtors: number;
  unpaidDebtors: number;
  fullyPaidDebtors: number;
}

export interface ConnectionSettings {
  scriptUrl: string; // Google Apps Script URL
  useLocalFallback: boolean; // Set to true to store in localStorage and work completely standalone
}
