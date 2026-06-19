import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Camera, ImageUp, AlertCircle } from 'lucide-react';
import { startScanner, scanFile } from '../scanner';

interface Props {
  open: boolean;
  onClose: () => void;
  onScan: (text: string) => void;
  onError: (msg: string) => void;
}

export function ScannerModal({ open, onClose, onScan, onError }: Props) {
  const readerRef = useRef<HTMLDivElement>(null);
  const stopRef = useRef<(() => Promise<void>) | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [camError, setCamError] = useState<string | null>(null);
  const [camReady, setCamReady] = useState(false);

  const reset = useCallback(() => { setCamError(null); setCamReady(false); }, []);

  useEffect(() => {
    if (!open) { reset(); return; }
    if (!readerRef.current) return;
    const id = 'qr-reader';
    readerRef.current.id = id;

    startScanner(
      id,
      (text) => { stopRef.current?.(); onScan(text); onClose(); },
      (err) => { setCamError(err); },
    )
      .then((s) => { stopRef.current = s.stop; setCamReady(true); })
      .catch((err) => { setCamError(err.message); });

    return () => { stopRef.current?.(); };
  }, [open, onScan, onClose, reset]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await scanFile(file);
      onScan(text);
      onClose();
    } catch (err: any) {
      onError('图片解码失败: ' + (err.message || err));
    }
  }

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
              <span className="modal-title">扫码识别</span>
              <button className="modal-close" onClick={onClose}><X size={14} /></button>
            </div>

            {camError && (
              <div className="scanner-error">
                <AlertCircle size={14} />
                <span>{camError}</span>
              </div>
            )}

            <div className="scanner-wrap" style={{ opacity: camError ? 0.4 : 1 }}>
              <div className="scanner-corner tl"></div>
              <div className="scanner-corner tr"></div>
              <div className="scanner-corner bl"></div>
              <div className="scanner-corner br"></div>
              <div ref={readerRef} id="qr-reader" />
              {!camReady && !camError && <div className="scanner-loading">正在启动摄像头...</div>}
            </div>

            <div className="scanner-actions">
              {camError && (
                <button className="btn btn-outline" onClick={() => { reset(); onClose(); setTimeout(() => onClose(), 0); }}>
                  <Camera size={16} />重试摄像头
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFile}
              />
              <button className="btn btn-outline" onClick={() => fileRef.current?.click()}>
                <ImageUp size={16} />选择本地图片
              </button>
            </div>

            {!camError && <div className="modal-hint">将二维码或条形码置于框内，即可自动扫描</div>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
