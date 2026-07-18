export async function startScanner(
  elementId: string,
  onScan: (text: string) => void,
  _onError: (err: string) => void,
): Promise<{ stop: () => Promise<void> }> {
  const { Html5Qrcode } = await import("html5-qrcode");
  const reader = new Html5Qrcode(elementId);
  await reader.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 250, height: 250 } },
    onScan,
    () => {},
  );
  return {
    stop: async () => {
      try {
        if (reader.isScanning) await reader.stop();
      } catch {
        /* ignore */
      }
    },
  };
}

export async function scanFile(file: File): Promise<string> {
  const { Html5Qrcode } = await import("html5-qrcode");
  const el = document.createElement("div");
  el.id = "_qr_tmp_" + Date.now();
  el.style.display = "none";
  document.body.appendChild(el);
  try {
    const reader = new Html5Qrcode(el.id);
    return await reader.scanFile(file, false);
  } finally {
    document.body.removeChild(el);
  }
}
