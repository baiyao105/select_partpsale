import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageUp, AlertCircle, RotateCcw } from "lucide-react";
import { startScanner, scanFile } from "../scanner";

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

  const reset = useCallback(() => {
    setCamError(null);
    setCamReady(false);
  }, []);

  function startWithTimeout() {
    if (!readerRef.current) return () => {};
    const id = "qr-reader";
    readerRef.current.id = id;

    let cancelled = false;
    const timer = setTimeout(() => {
      cancelled = true;
      setCamError("摄像头启动超时");
    }, 7000);

    navigator.permissions
      .query({ name: "camera" as PermissionName })
      .then((r) => {
        if (r.state === "denied" && !cancelled) {
          clearTimeout(timer);
          cancelled = true;
          setCamError("摄像头权限被拒绝");
        }
      })
      .catch(() => {});

    startScanner(
      id,
      (text) => {
        if (!cancelled) {
          clearTimeout(timer);
          stopRef.current?.();
          onScan(text);
          onClose();
        }
      },
      (msg) => {
        if (!cancelled) {
          clearTimeout(timer);
          setCamError(msg);
        }
      },
    )
      .then((s) => {
        if (!cancelled) {
          clearTimeout(timer);
          stopRef.current = s.stop;
          setCamReady(true);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          clearTimeout(timer);
          setCamError(err.message);
        }
      });

    return () => {
      clearTimeout(timer);
      cancelled = true;
      stopRef.current?.();
    };
  }

  useEffect(() => {
    if (!open) {
      reset();
      return;
    }
    const stop = startWithTimeout();
    return stop;
  }, [open, onScan, onClose, reset]);

  function retry() {
    reset();
    stopRef.current?.();
    setTimeout(() => startWithTimeout(), 50);
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await scanFile(file);
      onScan(text);
      onClose();
    } catch (err: any) {
      onError("图片解码失败: " + (err.message || err));
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
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
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
              <button className="modal-close" onClick={onClose}>
                <X size={14} />
              </button>
            </div>

            <div className="scanner-view">
              <div className="scanner-frame">
                <div className="scanner-hint">将二维码放入框内</div>
                <div ref={readerRef} id="qr-reader" className="scanner-video" />

                {!camReady && !camError && (
                  <div className="scanner-overlay">
                    <div className="scanner-spinner" />
                    <span>正在启动摄像头...</span>
                  </div>
                )}

                {camError && (
                  <div className="scanner-overlay scanner-overlay-error">
                    <AlertCircle size={20} />
                    <span className="scanner-err-text">{camError}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="scanner-foot">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFile}
              />
              <button
                className="scanner-foot-btn"
                onClick={() => fileRef.current?.click()}
              >
                <ImageUp size={15} />
                选择本地图片
              </button>
              {camError && (
                <button
                  className="scanner-foot-btn scanner-foot-btn-retry"
                  onClick={retry}
                >
                  <RotateCcw size={15} />
                  重试
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
