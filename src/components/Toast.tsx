import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ToastType } from '../types';

interface Props {
  message: string | null;
  type: ToastType;
  onDone: () => void;
}

export function Toast({ message, type, onDone }: Props) {
  useEffect(() => {
    if (message) { const id = setTimeout(onDone, 2000); return () => clearTimeout(id); }
  }, [message, onDone]);

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          className={`toast ${type}`}
          initial={{ opacity: 0, y: 100, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 100, x: '-50%' }}
          transition={{ duration: 0.3, ease: [0.1, 0.9, 0.2, 1] }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
