import { Transaction, Debtor } from './types';

/**
 * Custom error class for API failures
 */
export class ApiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Execute a fetch block with timeout
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new ApiError('Request timed out. Please check your network connection and Apps Script URL.', 408);
    }
    throw error;
  }
}

export const api = {
  /**
   * Get all debtors status and balance
   */
  async getDebts(scriptUrl: string): Promise<Debtor[]> {
    try {
      const url = `${scriptUrl}?action=getDebts&t=${Date.now()}`;
      const response = await fetchWithTimeout(url);
      if (!response.ok) {
        throw new ApiError(`Failed to fetch debts. Server responded with ${response.status}`, response.status);
      }
      return await response.json();
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(`Network Connection Error: ${err.message || 'Make sure your Google Script Deployment URL is correct and accepts permissions.'}`);
    }
  },

  /**
   * Get all unique names for autocomplete suggestions
   */
  async getNames(scriptUrl: string): Promise<string[]> {
    try {
      const url = `${scriptUrl}?action=getNames&t=${Date.now()}`;
      const response = await fetchWithTimeout(url);
      if (!response.ok) {
        throw new ApiError(`Failed to fetch names. Server responded with ${response.status}`, response.status);
      }
      return await response.json();
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(`Network Connection Error: ${err.message || 'Unable to fetch autocomplete suggestions.'}`);
    }
  },

  /**
   * Get transaction history for a specific debtor
   */
  async getHistory(scriptUrl: string, name: string): Promise<any[]> {
    try {
      const encodedName = encodeURIComponent(name);
      const url = `${scriptUrl}?action=getHistory&name=${encodedName}&t=${Date.now()}`;
      const response = await fetchWithTimeout(url);
      if (!response.ok) {
        throw new ApiError(`Failed to fetch history. Server responded with ${response.status}`, response.status);
      }
      return await response.json();
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(`Network Connection Error: ${err.message || 'Unable to fetch debtor history.'}`);
    }
  },

  /**
   * Create a BORROW transaction
   */
  async addDebt(scriptUrl: string, name: string, amount: number): Promise<any> {
    try {
      const response = await fetchWithTimeout(scriptUrl, {
        method: 'POST',
        // Using text/plain to avoid preflight CORS issues with certain redirect sequences
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          action: 'addDebt',
          name,
          amount
        })
      });
      if (!response.ok) {
        throw new ApiError(`Failed to add debt. Server responded with ${response.status}`, response.status);
      }
      return await response.json();
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(`Network Connection Error: ${err.message || 'Unable to save borrow transaction.'}`);
    }
  },

  /**
   * Create a PAYMENT transaction
   */
  async addPayment(scriptUrl: string, name: string, amount: number): Promise<any> {
    try {
      const response = await fetchWithTimeout(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          action: 'addPayment',
          name,
          amount
        })
      });
      if (!response.ok) {
        throw new ApiError(`Failed to add payment. Server responded with ${response.status}`, response.status);
      }
      return await response.json();
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(`Network Connection Error: ${err.message || 'Unable to save payment transaction.'}`);
    }
  },

  /**
   * Edit an existing transaction details in Google Sheets
   */
  async editTransaction(scriptUrl: string, id: string, name: string, amount: number, type: 'BORROW' | 'PAYMENT'): Promise<any> {
    try {
      const response = await fetchWithTimeout(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          action: 'editTransaction',
          id,
          name,
          amount,
          type
        })
      });
      if (!response.ok) {
        throw new ApiError(`Failed to edit transaction. Server responded with ${response.status}`, response.status);
      }
      return await response.json();
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(`Network Connection Error: ${err.message || 'Unable to update transaction details.'}`);
    }
  },

  /**
   * Delete a transaction from Google Sheets
   */
  async deleteTransaction(scriptUrl: string, id: string): Promise<any> {
    try {
      const response = await fetchWithTimeout(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          action: 'deleteTransaction',
          id
        })
      });
      if (!response.ok) {
        throw new ApiError(`Failed to delete transaction. Server responded with ${response.status}`, response.status);
      }
      return await response.json();
    } catch (err: any) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(`Network Connection Error: ${err.message || 'Unable to delete transaction.'}`);
    }
  }
};
