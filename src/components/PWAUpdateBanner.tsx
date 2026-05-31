import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PWAUpdateBanner() {
  const { needRefresh: [needRefresh], updateServiceWorker } = useRegisterSW();

  return (
    <AnimatePresence>
      {needRefresh && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          className="fixed bottom-20 left-4 right-4 max-w-sm mx-auto z-50"
        >
          <div className="bg-slate-900 text-white rounded-2xl shadow-2xl px-4 py-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-white leading-none">Update Available</p>
              <p className="text-[10px] text-slate-400 mt-0.5">A new version is ready to install.</p>
            </div>
            <button
              onClick={() => updateServiceWorker(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-[11px] font-semibold rounded-xl transition-all active:scale-95 whitespace-nowrap shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Update
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
