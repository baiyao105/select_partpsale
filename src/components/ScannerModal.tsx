import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImageUp, AlertCircle, RotateCcw } from "lucide-react";
import { startScanner, decodeImage } from "../scanner";

interface Props {
  open: boolean;
  onClose: () => void;
  onScan: (text: string) => void;
}

export function ScannerModal({ open, onClose, onScan }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [camError, setCamError] = useState<string | null>(null);
  const [camReady, setCamReady] = useState(false);
  const [key, setKey] = useState(0);
  const onScanRef = useRef(onScan);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onScanRef.current = onScan;
    onCloseRef.current = onClose;
  });

  const startWithTimeout = useCallback(() => {
    if (!videoRef.current) return () => {};
    let cancelled = false;
    const timer = setTimeout(() => {
      cancelled = true;
      setCamError("摄像头启动超时");
    }, 7000);

    startScanner(videoRef.current, (text) => {
      if (!cancelled) {
        clearTimeout(timer);
        stopRef.current?.();
        onScanRef.current(text);
        onCloseRef.current();
      }
    })
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
          const msg = err instanceof Error ? err.message : String(err);
          if (msg.includes("Permission")) {
            setCamError("摄像头权限被拒绝");
          } else {
            setCamError(msg);
          }
        }
      });

    return () => {
      clearTimeout(timer);
      cancelled = true;
      stopRef.current?.();
      const s = videoRef.current?.srcObject as MediaStream | null;
      s?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const stop = startWithTimeout();
    return stop;
  }, [open, key, startWithTimeout]);

  useEffect(() => {
    if (!open) {
      setCamError(null);
      setCamReady(false);
    }
  }, [open]);

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose],
  );

  const handleFileClick = useCallback(() => fileRef.current?.click(), []);

  const handleRetry = useCallback(() => {
    stopRef.current?.();
    setCamError(null);
    setCamReady(false);
    setKey((k) => k + 1);
  }, []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await decodeImage(file);
      onScan(text);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      window.alert("图片解码失败: " + msg);
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
          onClick={handleBackdropClick}
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
                <div className="scan-region">
                  <div className="scan-corner scan-tl-h" />
                  <div className="scan-corner scan-tl-v" />
                  <div className="scan-corner scan-tr-h" />
                  <div className="scan-corner scan-tr-v" />
                  <div className="scan-corner scan-bl-h" />
                  <div className="scan-corner scan-bl-v" />
                  <div className="scan-corner scan-br-h" />
                  <div className="scan-corner scan-br-v" />
                </div>
                <div className="scan-shading" />
                <div className="scanner-hint">将二维码放入框内</div>
                <video
                  ref={videoRef}
                  className="scanner-video"
                  playsInline
                  muted
                  disablePictureInPicture
                  disableRemotePlayback
                />

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
              <button className="scanner-foot-btn" onClick={handleFileClick}>
                <ImageUp size={15} />
                选择本地图片
              </button>
              {camError && (
                <button
                  className="scanner-foot-btn scanner-foot-btn-retry"
                  onClick={handleRetry}
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
