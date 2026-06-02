import { useEffect } from 'react';
import { useDebtStore } from '../store';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export default function StatusToast() {
  const notification = useDebtStore((state) => state.notification);
  const clearNotification = useDebtStore((state) => state.clearNotification);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        className="pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-xl border backdrop-blur-md bg-white/95 border-slate-200"
      >
        <div className="flex-shrink-0">
          {notification.type === 'success' && (
            <CheckCircle2 id="icon-success" className="w-5 h-5 text-emerald-600" />
          )}
          {notification.type === 'error' && (
            <AlertTriangle id="icon-error" className="w-5 h-5 text-rose-600" />
          )}
          {notification.type === 'info' && <Info id="icon-info" className="w-5 h-5 text-sky-600" />}
        </div>

        <div className="flex-grow text-xs font-medium text-slate-800 leading-snug">
          {notification.message}
        </div>

        <button
          id="btn-close-toast"
          onClick={clearNotification}
          className="flex-shrink-0 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
