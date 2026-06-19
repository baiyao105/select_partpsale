import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { startScanner } from '../scanner';

interface Props {
  open: boolean;
  onClose: () => void;
  onScan: (text: string) => void;
  onError: (msg: string) => void;
}

export function ScannerModal({ open, onClose, onScan, onError }: Props) {
  const readerRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    if (!open || !readerRef.current) return;
    const id = 'qr-reader';
    readerRef.current.id = id;

    startScanner(
      id,
      (text) => { stopRef.current?.(); onScan(text); onClose(); },
      (err) => { onError(err); onClose(); },
    )
      .then((s) => { stopRef.current = s.stop; })
      .catch((err) => { onError(err.message); onClose(); });

    return () => { stopRef.current?.(); };
  }, [open, onScan, onClose, onError]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal on"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            className="modal-box"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="modal-head">
              <span className="modal-title">扫描二维码/条形码</span>
              <button className="modal-close" onClick={onClose}><X size={14} /></button>
            </div>
            <div className="scanner-wrap">
              <div className="scanner-corner tl"></div>
              <div className="scanner-corner tr"></div>
              <div className="scanner-corner bl"></div>
              <div className="scanner-corner br"></div>
              <div ref={readerRef} id="qr-reader" />
            </div>
            <div className="modal-hint">将二维码或条形码置于框内，即可自动扫描</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
