/// <reference types="vite/client" />

declare module "webadb" {
  const Adb: any;
  export default Adb;
  export = Adb;
}

declare module "html5-qrcode" {
  export class Html5Qrcode {
    constructor(elementId: string);
    start(
      config: { facingMode: string },
      qrConfig: { fps: number; qrbox: { width: number; height: number } },
      onScan: (text: string) => void,
      onError: () => void,
    ): Promise<void>;
    stop(): Promise<void>;
    isScanning: boolean;
    clear(): void;
    scanFile(file: File, showImage?: boolean): Promise<string>;
  }
}

interface Navigator {
  usb?: any;
}
