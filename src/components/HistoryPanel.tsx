import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronDown, X, Trash2 } from "lucide-react";

interface Props {
  history: string[];
  onSelect: (code: string) => void;
  onRemove: (code: string) => void;
  onClearAll: () => void;
}

export function HistoryPanel({
  history,
  onSelect,
  onRemove,
  onClearAll,
}: Props) {
  const [open, setOpen] = useState(false);

  if (history.length === 0) return null;

  return (
    <div className={`expander history-panel ${open ? "open" : ""}`}>
      <div
        className="expander-head"
        onClick={() => setOpen(!open)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") setOpen(!open);
        }}
      >
        <div className="expander-icon gray">
          <Clock size={16} />
        </div>
        <div className="expander-text">
          <div className="expander-title">历史查询</div>
          <div className="expander-count">{history.length} 项</div>
        </div>
        <motion.div
          className="expander-arrow"
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} />
        </motion.div>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="expander-body"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="expander-content">
              <div className="history-actions">
                <button className="history-clear-all" onClick={onClearAll}>
                  <Trash2 size={12} />
                  清空全部
                </button>
              </div>
              {history.map((code) => (
                <div
                  key={code}
                  className="history-item"
                  onClick={() => onSelect(code)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSelect(code);
                  }}
                >
                  <span className="history-code">{code}</span>
                  <button
                    className="history-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(code);
                    }}
                    title="删除"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
