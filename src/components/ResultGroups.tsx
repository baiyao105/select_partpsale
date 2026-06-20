import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Info, ChevronsUpDown } from 'lucide-react';
import { ResultGroup } from './ResultGroup';
import { ResultField } from './ResultField';
import { GROUPS } from '../config';
import type { QueryData } from '../types';

interface Props {
  data: QueryData;
  onCopy: (text: string) => void;
  hideEmpty?: boolean;
  onToggleHideEmpty?: () => void;
}

function ExtraSection({ extra, onCopy, defaultOpen, onToggle, hideEmpty }: { 
  extra: [string, string | null | undefined][]; 
  onCopy: (text: string) => void;
  defaultOpen?: boolean;
  onToggle?: (open: boolean) => void;
  hideEmpty?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);

  const filteredExtra = hideEmpty 
    ? extra.filter(([_, val]) => val != null && val !== '' && val !== 'null')
    : extra;

  if (hideEmpty && filteredExtra.length === 0) return null;

  const handleToggle = () => {
    const newOpen = !open;
    setOpen(newOpen);
    onToggle?.(newOpen);
  };

  return (
    <div className={`expander extra-section ${open ? 'open' : ''}`}>
      <div className="expander-head" onClick={handleToggle} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') handleToggle(); }}>
        <div className="expander-icon gray"><Info size={16} /></div>
        <div className="expander-text">
          <div className="expander-title">扩展信息</div>
          <div className="expander-count">{filteredExtra.length} 项</div>
        </div>
        <motion.div className="expander-arrow" animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
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
            transition={{ duration: 0.25 }}
          >
            <div className="expander-content">
              {filteredExtra.map(([key, val]) => (
                <ResultField key={key} fieldKey={key} value={val != null && val !== '' ? String(val) : 'null'} onCopy={onCopy} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ResultGroups({ data, onCopy, hideEmpty = false, onToggleHideEmpty }: Props) {
  const [allExpanded, setAllExpanded] = useState(true);

  const entries = Object.entries(data);
  if (entries.length === 0) return <div className="empty">返回数据为空</div>;

  const defined = new Set(GROUPS.flatMap((g) => g.keys));
  const extra = entries.filter(([key]) => !defined.has(key));

  const handleToggleAll = () => {
    const newAllExpanded = !allExpanded;
    setAllExpanded(newAllExpanded);
  };

  return (
    <motion.div className="results on" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <div className="results-header">
        <button 
          className="results-toggle" 
          onClick={handleToggleAll}
        >
          <ChevronsUpDown size={14} />
          {allExpanded ? '全部收起' : '全部展开'}
        </button>
        <button 
          className={`results-toggle ${hideEmpty ? 'active' : ''}`}
          onClick={onToggleHideEmpty}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {hideEmpty ? (
              <>
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                <line x1="1" y1="1" x2="23" y2="23" />
              </>
            ) : (
              <>
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </>
            )}
          </svg>
          {hideEmpty ? '隐藏空值' : '显示空值'}
        </button>
      </div>
      <div className="results-grid">
        {GROUPS.map((group) => (
          <ResultGroup 
            key={group.id} 
            group={group} 
            data={data} 
            onCopy={onCopy} 
            defaultOpen={allExpanded}
            hideEmpty={hideEmpty}
          />
        ))}
        {extra.length > 0 && (
          <ExtraSection 
            extra={extra} 
            onCopy={onCopy} 
            defaultOpen={allExpanded}
            hideEmpty={hideEmpty}
          />
        )}
      </div>
    </motion.div>
  );
}
