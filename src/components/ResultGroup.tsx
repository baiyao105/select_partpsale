import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Hash, Smartphone, ShoppingBag, Clock, Info } from 'lucide-react';
import { ResultField } from './ResultField';
import type { FieldGroup } from '../types';
import { CFG } from '../config';

const ICON_MAP: Record<string, ReactNode> = {
  Hash: <Hash size={16} />,
  Smartphone: <Smartphone size={16} />,
  ShoppingBag: <ShoppingBag size={16} />,
  Clock: <Clock size={16} />,
};

interface Props {
  group: FieldGroup;
  data: Record<string, string | null | undefined>;
  onCopy: (text: string) => void;
  defaultOpen?: boolean;
  hideEmpty?: boolean;
}

export function ResultGroup({ group, data, onCopy, defaultOpen = true, hideEmpty = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    setOpen(defaultOpen);
  }, [defaultOpen]);

  const handleToggle = () => {
    setOpen(!open);
  };

  const items: { key: string; value: string }[] = [];
  for (const key of group.keys) {
    const val = data[key];
    if (hideEmpty) {
      if (val == null || val === '' || val === 'null') continue;
    }
    if (!CFG.SKIP.has(key)) {
      items.push({ key, value: val != null && val !== '' ? String(val) : 'null' });
    }
  }

  if (items.length === 0) return null;

  return (
    <div className={`expander ${open ? 'open' : ''}`}>
      <div className="expander-head" onClick={handleToggle} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleToggle(); }}>
        <div className={`expander-icon ${group.color}`}>{ICON_MAP[group.icon] || <Info size={16} />}</div>
        <div className="expander-text">
          <div className="expander-title">{group.title}</div>
          <div className="expander-count">{items.length} 项</div>
        </div>
        <motion.div className="expander-arrow" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={14} />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="expander-body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
          >
            <div className="expander-content">
              {items.map((item) => (
                <ResultField key={item.key} fieldKey={item.key} value={item.value} onCopy={onCopy} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
