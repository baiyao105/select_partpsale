import {
  readBarcodes,
  prepareZXingModule,
  type ReadResult,
} from "zxing-wasm/reader";

const wasmReady = prepareZXingModule({ fireImmediately: true });

export async function startScanner(
  video: HTMLVideoElement,
  onScan: (text: string) => void,
): Promise<{ stop: () => void }> {
  await wasmReady;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  let running = true;
  let decoding = false;
  let raf: number | null = null;
  let stream: MediaStream | null = null;

  stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "environment",
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
  });

  video.srcObject = stream;
  await video.play();

  const tick = () => {
    if (!running || decoding) return;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      decoding = true;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0);
      const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
      readBarcodes(img, {
        formats: ["QRCode"],
        tryHarder: true,
        tryRotate: true,
        tryInvert: true,
        tryDownscale: true,
        maxNumberOfSymbols: 1,
      })
        .then((results: ReadResult[]) => {
          if (results.length > 0 && results[0].text) {
            onScan(results[0].text);
            return;
          }
          if (running) raf = requestAnimationFrame(tick);
        })
        .catch(() => {
          if (running) raf = requestAnimationFrame(tick);
        })
        .finally(() => {
          decoding = false;
        });
    } else {
      raf = requestAnimationFrame(tick);
    }
  };
  raf = requestAnimationFrame(tick);

  return {
    stop() {
      running = false;
      if (raf !== null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
      stream?.getTracks().forEach((t) => t.stop());
      video.srcObject = null;
    },
  };
}

export async function decodeImage(file: File): Promise<string> {
  await wasmReady;
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const results = await readBarcodes(data, {
      formats: ["QRCode"],
      tryHarder: true,
      tryRotate: true,
      tryInvert: true,
      tryDownscale: true,
      maxNumberOfSymbols: 1,
    });
    if (results.length > 0 && results[0].text) return results[0].text;
    throw new Error("未识别到二维码");
  } finally {
    URL.revokeObjectURL(url);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
