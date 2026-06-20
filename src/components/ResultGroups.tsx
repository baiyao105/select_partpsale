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
}

function ExtraSection({ extra, onCopy }: { extra: [string, string | null | undefined][]; onCopy: (text: string) => void }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`expander extra-section ${open ? 'open' : ''}`}>
      <div className="expander-head" onClick={() => setOpen(!open)} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') setOpen(!open); }}>
        <div className="expander-icon gray"><Info size={16} /></div>
        <div className="expander-text">
          <div className="expander-title">扩展信息</div>
          <div className="expander-count">{extra.length} 项</div>
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
              {extra.map(([key, val]) => (
                <ResultField key={key} fieldKey={key} value={val != null && val !== '' ? String(val) : 'null'} onCopy={onCopy} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ResultGroups({ data, onCopy }: Props) {
  const [allExpanded, setAllExpanded] = useState(true);

  const entries = Object.entries(data);
  if (entries.length === 0) return <div className="empty">返回数据为空</div>;

  const defined = new Set(GROUPS.flatMap((g) => g.keys));
  const extra = entries.filter(([key]) => !defined.has(key));

  return (
    <motion.div className="results on" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      <div className="results-header">
        <button 
          className="results-toggle" 
          onClick={() => setAllExpanded(!allExpanded)}
        >
          <ChevronsUpDown size={14} />
          {allExpanded ? '全部收起' : '全部展开'}
        </button>
      </div>
      {GROUPS.map((group) => (
        <ResultGroup key={group.id} group={group} data={data} onCopy={onCopy} defaultOpen={allExpanded} />
      ))}
      {extra.length > 0 && <ExtraSection extra={extra} onCopy={onCopy} />}
    </motion.div>
  );
}
