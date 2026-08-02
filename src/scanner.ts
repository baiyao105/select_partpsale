import { BrowserQRCodeReader } from "@zxing/browser";

export async function startScanner(
  videoElement: HTMLVideoElement,
  onScan: (text: string) => void,
): Promise<{ stop: () => void }> {
  const reader = new BrowserQRCodeReader();

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "environment",
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
  });

  videoElement.srcObject = stream;

  const controls = await reader.decodeFromVideoElement(
    videoElement,
    (result) => {
      if (result) {
        onScan(result.getText());
      }
    },
  );

  return {
    stop: () => {
      controls?.stop();
      stream.getTracks().forEach((t) => t.stop());
      videoElement.srcObject = null;
    },
  };
}

export async function decodeImage(file: File): Promise<string> {
  const reader = new BrowserQRCodeReader();
  const url = URL.createObjectURL(file);
  try {
    const result = await reader.decodeFromImageUrl(url);
    if (result) return result.getText();
    throw new Error("未识别到二维码");
  } finally {
    URL.revokeObjectURL(url);
  }
}
