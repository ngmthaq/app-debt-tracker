import { useState } from 'react';
import { useDebtStore } from '../store';
import { APPS_SCRIPT_CODE } from '../appsScriptSource';
import { Database, Copy, Check, Info, FileSpreadsheet, Play, Power, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SetupGuideModal({ isOpen, onClose }: SetupGuideModalProps) {
  const settings = useDebtStore((state) => state.settings);
  const updateSettings = useDebtStore((state) => state.updateSettings);
  const syncLocalToSheets = useDebtStore((state) => state.syncLocalToSheets);
  const isLoading = useDebtStore((state) => state.isLoading);

  const [scriptUrl, setScriptUrl] = useState(settings.scriptUrl);
  const [useLocal, setUseLocal] = useState(settings.useLocalFallback);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'code'>('config');

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(APPS_SCRIPT_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleSaveSettings = async () => {
    // If we're enabling sheets, check that there is an URL
    if (!useLocal && !scriptUrl.trim()) {
      alert('Please provide your Google Apps Script Web App URL or use local storage.');
      return;
    }

    await updateSettings(scriptUrl.trim(), useLocal);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 50 }}
        id="setup-modal"
        className="w-full sm:max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white p-5 border-b border-slate-100 flex items-center justify-between z-10">
          <div>
            <h3
              id="setup-title"
              className="font-display text-lg font-bold text-slate-800 flex items-center gap-2"
            >
              <Database className="w-5 h-5 text-indigo-600" />
              Database Options
            </h3>
            <p className="text-xs text-slate-500">Connect Google Sheets in seconds</p>
          </div>
          <button
            id="btn-close-setup"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-100 p-2 bg-slate-50/50">
          <button
            id="tab-config"
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'config'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Settings & Connection
          </button>
          <button
            id="tab-code"
            onClick={() => setActiveTab('code')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'code'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Apps Script Code
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto grow space-y-5">
          {activeTab === 'config' && (
            <div className="space-y-4">
              {/* Local vs Sheets Toggle Card */}
              <div className="p-4 rounded-xl border border-slate-100 bg-indigo-50/30 space-y-3">
                <span className="text-[11px] font-bold text-indigo-700 tracking-wider uppercase">
                  Storage Strategy
                </span>

                <div id="toggle-container" className="flex flex-col gap-2.5">
                  <label className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                    <input
                      type="radio"
                      name="storageMode"
                      checked={useLocal}
                      onChange={() => setUseLocal(true)}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <Power className="w-3.5 h-3.5 text-slate-500" />
                        Demo Ledger Mode (Local Storage)
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Data is cached locally in your browser. Perfect for testing and viewing
                        immediately.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-white hover:shadow-sm transition-all cursor-pointer">
                    <input
                      type="radio"
                      name="storageMode"
                      checked={!useLocal}
                      onChange={() => setUseLocal(false)}
                      className="mt-1 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                    />
                    <div>
                      <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                        Google Sheets Live Sync Mode
                      </span>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        Read/write values securely to your private Google Sheets database in
                        real-time.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Apps Script URL Input */}
              {!useLocal && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Google Apps Script Web App URL
                  </label>
                  <input
                    id="input-script-url"
                    type="url"
                    placeholder="https://script.google.com/macros/s/.../exec"
                    value={scriptUrl}
                    onChange={(e) => setScriptUrl(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs text-slate-800 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Must start with <span className="font-mono">https://script.google.com</span>
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  id="btn-save-database"
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs py-3 rounded-lg shadow-sm hover:shadow active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isLoading ? 'Updating...' : 'Save Storage Configuration'}
                </button>

                {/* Migrating local data to Sheets helper */}
                {!useLocal && scriptUrl.trim() && (
                  <button
                    id="btn-migrate-sheets"
                    onClick={syncLocalToSheets}
                    disabled={isLoading}
                    className="w-full border border-dashed border-emerald-300 text-emerald-700 hover:bg-emerald-50/50 bg-emerald-50/20 font-medium text-xs py-2.5 rounded-lg active:scale-[0.98] transition-all"
                  >
                    Sync Offline Transactions to Sheets
                  </button>
                )}
              </div>

              {/* Helper text */}
              <div className="flex gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                <span>
                  By default, you are in <strong>Demo Mode</strong> where operations are fast and do
                  not require external configuration. Ready to use Google Sheets? Click the{' '}
                  <strong>&quot;Apps Script Code&quot;</strong> tab to easily configure it.
                </span>
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4">
              {/* Instructions list */}
              <div className="space-y-2.5 text-[11.5px] text-slate-600 leading-relaxed">
                <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 mb-1">
                  <Play className="w-3.5 h-3.5 text-indigo-500" />
                  Quick Installation Guide (5 Steps)
                </h4>
                <ol className="list-decimal pl-4.5 space-y-1.5 font-sans leading-normal">
                  <li>
                    Create a new spreadsheet in <strong>Google Sheets</strong>.
                  </li>
                  <li>
                    In the top menu, go to <strong>Extensions &gt; Apps Script</strong>.
                  </li>
                  <li>
                    Click the <strong>&quot;Copy Code&quot;</strong> button below. Delete any
                    boilerplate, and paste this script there.
                  </li>
                  <li>
                    In the top right, click <strong>Deploy &gt; New deployment</strong>. Select{' '}
                    <strong>&quot;Web App&quot;</strong>. Execute as:{' '}
                    <strong>&quot;Me&quot;</strong>, Who has access:{' '}
                    <strong>&quot;Anyone&quot;</strong>. Click deploy.
                  </li>
                  <li>
                    Authorize Google permissions. Copy your unique <strong>Web App URL</strong> and
                    paste it in the <strong>Settings tab</strong>!
                  </li>
                </ol>
              </div>

              {/* Code display Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    gas_code.js
                  </span>
                  <button
                    id="btn-copy-code"
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 text-[10px] font-medium transition-all"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="relative rounded-lg bg-slate-950 p-4 border border-slate-900 shadow-inner overflow-hidden max-h-56">
                  <pre className="text-[10.5px] font-mono text-indigo-100 leading-relaxed overflow-auto max-h-48 no-scrollbar scroll-smooth">
                    {APPS_SCRIPT_CODE}
                  </pre>
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-slate-950 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
