import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger',
  onConfirm,
  onCancel
}: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          {/* Backdrop click */}
          <div className="absolute inset-0" onClick={onCancel} />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="glass-card relative rounded-3xl border border-white/10 w-full max-w-md p-8 shadow-[0_0_80px_rgba(239,68,68,0.1)] text-center overflow-hidden z-50 bg-[#0c0d12]"
          >
            {/* Ambient glows inside modal */}
            <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full blur-[80px] pointer-events-none ${
              type === 'danger' ? 'bg-red-500/10' : 'bg-amber-500/10'
            }`} />
            
            <button
              onClick={onCancel}
              className="absolute top-5 right-5 text-gray-500 hover:text-white transition-colors cursor-none p-1.5 rounded-full hover:bg-white/5 hover-target"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border ${
              type === 'danger'
                ? 'bg-red-500/10 border-red-500/20 text-red-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
            }`}>
              {type === 'danger' ? (
                <Trash2 className="w-8 h-8 animate-pulse" />
              ) : (
                <AlertTriangle className="w-8 h-8 animate-pulse" />
              )}
            </div>

            <h3 className="text-xl font-bold font-heading text-white mb-2">
              {title}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 px-2">
              {message}
            </p>

            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="flex-1 py-3 bg-white/5 border border-white/10 text-gray-300 font-semibold rounded-xl hover:bg-white/10 transition-all cursor-none hover-target"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-3 text-white font-semibold rounded-xl hover:scale-[1.02] active:scale-95 transition-all cursor-none hover-target shadow-lg ${
                  type === 'danger'
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 shadow-red-600/20'
                    : 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-amber-500/20'
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
