import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  onConfirm,
  onCancel
}: ConfirmModalProps) => {
  const Icon = type === 'danger' ? Trash2 : AlertTriangle;
  const colorClass = type === 'danger' ? 'text-red-500' : 'text-orange-500';
  const bgClass = type === 'danger' ? 'bg-red-500/10' : 'bg-orange-500/10';
  const borderClass = type === 'danger' ? 'border-red-500/20' : 'border-orange-500/20';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-xl" 
            onClick={onCancel}
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-md bg-stone-900 border ${borderClass} rounded-2xl shadow-2xl overflow-hidden p-6`}
          >
            <div className={`absolute top-0 left-0 w-full h-1 ${type === 'danger' ? 'bg-red-500' : 'bg-orange-500'}`} />
            
            <button 
              onClick={onCancel}
              className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors cursor-none hover-target"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-full ${bgClass} flex items-center justify-center mb-6 animate-pulse`}>
                <Icon className={`w-8 h-8 ${colorClass}`} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
              <p className="text-stone-400 text-sm mb-8">{message}</p>
              
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 px-4 rounded-xl bg-stone-800 text-white font-medium hover:bg-stone-700 transition-colors cursor-none hover-target"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`flex-1 py-3 px-4 rounded-xl text-white font-medium transition-colors cursor-none hover-target ${
                    type === 'danger' 
                      ? 'bg-red-500 hover:bg-red-600' 
                      : 'bg-orange-500 hover:bg-orange-600'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
