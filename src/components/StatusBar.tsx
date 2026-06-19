import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface Props {
  visible: boolean;
  loading: boolean;
  text: string;
  type: 'info' | 'ok' | 'err';
}

export function StatusBar({ visible, loading, text, type }: Props) {
  if (!visible) return null;

  return (
    <motion.div
      className={`status ${type}`}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
    >
      {loading && <Loader2 size={14} className="spinner" />}
      <span>{text}</span>
    </motion.div>
  );
}
