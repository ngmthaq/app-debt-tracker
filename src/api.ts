import { Transaction, Debtor } from './types';

/**
 * Custom error class for API failures
 */
export class ApiError extends Error {
  status?: number;
  code?: 'UNSUPPORTED_ACTION';

  constructor(message: string, status?: number, code?: 'UNSUPPORTED_ACTION') {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Apps Script web apps are slow by nature: /exec answers with a 302 to
 * script.googleusercontent.com (so every call is two round trips), and a cold
 * start can take 15s+ on its own before the script body even runs.
 */
const DEFAULT_TIMEOUT = 60000;

/**
 * Execute a fetch block with timeout.
 *
 * The abort signal stays armed until the body has been read, so a stalled
 * response stream can't hang past the deadline.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = DEFAULT_TIMEOUT
): Promise<string> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new ApiError(`Server responded with ${response.status}`, response.status);
    }
    return await response.text();
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new ApiError(
        `Request timed out after ${Math.round(timeout / 1000)}s. Apps Script may be cold-starting — try again, or check your network and deployment URL.`,
        408
      );
    }
    throw error;
  } finally {
    clearTimeout(id);
  }
}

/**
 * Apps Script cannot set HTTP status codes: ContentService always answers 200,
 * so backend failures arrive as a 200 carrying { error: "..." }. Unwrap that
 * here, otherwise callers hand an error object to code expecting a payload.
 */
function parsePayload<T>(body: string, context: string): T {
  let parsed: any;
  try {
    parsed = JSON.parse(body);
  } catch {
    // Usually the Google sign-in HTML page: the deployment isn't public.
    throw new ApiError(
      `${context}: the server returned a non-JSON response. Re-deploy the Apps Script with "Who has access" set to "Anyone".`
    );
  }

  if (parsed && !Array.isArray(parsed) && typeof parsed.error === 'string') {
    // A deployment predating this client rejects actions it has never heard
    // of. Tag it so callers can fall back instead of surfacing a dead end.
    const unsupported = /action not supported/i.test(parsed.error);
    throw new ApiError(
      `${context}: ${parsed.error}`,
      undefined,
      unsupported ? 'UNSUPPORTED_ACTION' : undefined
    );
  }

  return parsed as T;
}

/**
 * GET against the script. Retried once, because the failure mode we care about
 * is a cold start: the retry lands on a warm instance and returns quickly.
 * Reads are idempotent, so a retry is free — writes deliberately do not retry.
 *
 * The retry gets a shorter budget on purpose. If the first attempt timed out,
 * the instance is either warm now (answers in seconds) or genuinely
 * unreachable, so a second full 60s only delays showing the local fallback.
 */
const RETRY_TIMEOUT = 15000;

async function getJson<T>(url: string, context: string): Promise<T> {
  try {
    return parsePayload<T>(await fetchWithTimeout(url), context);
  } catch (err: any) {
    if (!(err instanceof ApiError) || err.status !== 408) throw err;
    return parsePayload<T>(await fetchWithTimeout(url, {}, RETRY_TIMEOUT), context);
  }
}

/**
 * POST against the script. Never retried: a retried write can double-post a
 * transaction, since a timeout means "no answer", not "no effect".
 */
async function postJson<T>(scriptUrl: string, body: unknown, context: string): Promise<T> {
  const raw = await fetchWithTimeout(scriptUrl, {
    method: 'POST',
    // Using text/plain to avoid preflight CORS issues with certain redirect sequences
    headers: {
      'Content-Type': 'text/plain',
    },
    body: JSON.stringify(body),
  });
  return parsePayload<T>(raw, context);
}

/**
 * Normalize anything thrown into an ApiError with a useful message
 */
function toApiError(err: any, fallback: string): ApiError {
  if (err instanceof ApiError) return err;
  return new ApiError(`Network Connection Error: ${err?.message || fallback}`);
}

export const api = {
  /**
   * Get every transaction in one request.
   *
   * The dashboard needs balances, the autocomplete needs names, and the detail
   * screen needs per-person history — all three are derivable from this single
   * payload. Fetching it once avoids firing concurrent cold starts at Apps
   * Script, which is what made the boot sequence time out.
   */
  async getTransactions(scriptUrl: string): Promise<Transaction[]> {
    try {
      const url = `${scriptUrl}?action=getAll&t=${Date.now()}`;
      const payload = await getJson<any>(url, 'Failed to fetch transactions');
      if (!Array.isArray(payload)) {
        throw new ApiError('Failed to fetch transactions: unexpected response shape.');
      }
      return payload.map((t: any) => ({
        id: String(t.id),
        name: String(t.name ?? ''),
        amount: Number(t.amount) || 0,
        note: t.note || '',
        type: t.type === 'PAYMENT' ? 'PAYMENT' : 'BORROW',
        createdAt: String(t.createdAt ?? ''),
      }));
    } catch (err: any) {
      throw toApiError(
        err,
        'Make sure your Google Script Deployment URL is correct and accepts permissions.'
      );
    }
  },

  /**
   * Get all debtors status and balance
   */
  async getDebts(scriptUrl: string): Promise<Debtor[]> {
    try {
      const url = `${scriptUrl}?action=getDebts&t=${Date.now()}`;
      return await getJson<Debtor[]>(url, 'Failed to fetch debts');
    } catch (err: any) {
      throw toApiError(
        err,
        'Make sure your Google Script Deployment URL is correct and accepts permissions.'
      );
    }
  },

  /**
   * Get all unique names for autocomplete suggestions
   */
  async getNames(scriptUrl: string): Promise<string[]> {
    try {
      const url = `${scriptUrl}?action=getNames&t=${Date.now()}`;
      return await getJson<string[]>(url, 'Failed to fetch names');
    } catch (err: any) {
      throw toApiError(err, 'Unable to fetch autocomplete suggestions.');
    }
  },

  /**
   * Get transaction history for a specific debtor
   */
  async getHistory(scriptUrl: string, name: string): Promise<any[]> {
    try {
      const encodedName = encodeURIComponent(name);
      const url = `${scriptUrl}?action=getHistory&name=${encodedName}&t=${Date.now()}`;
      return await getJson<any[]>(url, 'Failed to fetch history');
    } catch (err: any) {
      throw toApiError(err, 'Unable to fetch debtor history.');
    }
  },

  /**
   * Create a BORROW transaction
   */
  async addDebt(scriptUrl: string, name: string, amount: number, note?: string): Promise<any> {
    try {
      return await postJson(
        scriptUrl,
        { action: 'addDebt', name, amount, note: note || '' },
        'Failed to add debt'
      );
    } catch (err: any) {
      throw toApiError(err, 'Unable to save borrow transaction.');
    }
  },

  /**
   * Create a PAYMENT transaction
   */
  async addPayment(scriptUrl: string, name: string, amount: number, note?: string): Promise<any> {
    try {
      return await postJson(
        scriptUrl,
        { action: 'addPayment', name, amount, note: note || '' },
        'Failed to add payment'
      );
    } catch (err: any) {
      throw toApiError(err, 'Unable to save payment transaction.');
    }
  },

  /**
   * Edit an existing transaction details in Google Sheets
   */
  async editTransaction(
    scriptUrl: string,
    id: string,
    name: string,
    amount: number,
    type: 'BORROW' | 'PAYMENT',
    note?: string
  ): Promise<any> {
    try {
      return await postJson(
        scriptUrl,
        { action: 'editTransaction', id, name, amount, note: note || '', type },
        'Failed to edit transaction'
      );
    } catch (err: any) {
      throw toApiError(err, 'Unable to update transaction details.');
    }
  },

  /**
   * Delete a transaction from Google Sheets
   */
  async deleteTransaction(scriptUrl: string, id: string): Promise<any> {
    try {
      return await postJson(
        scriptUrl,
        { action: 'deleteTransaction', id },
        'Failed to delete transaction'
      );
    } catch (err: any) {
      throw toApiError(err, 'Unable to delete transaction.');
    }
  },

  /**
   * Delete every transaction in the sheet in a single request.
   *
   * Throws an ApiError with code UNSUPPORTED_ACTION against a deployment that
   * predates this action, which lets the caller fall back to per-row deletes.
   */
  async clearAll(scriptUrl: string): Promise<{ deleted?: number }> {
    try {
      return await postJson(scriptUrl, { action: 'clearAll' }, 'Failed to clear records');
    } catch (err: any) {
      throw toApiError(err, 'Unable to clear the sheet.');
    }
  },
};
