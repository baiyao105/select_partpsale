/// <reference types="vite/client" />

declare module 'html5-qrcode' {
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
  }
}

interface Navigator {
  usb?: USB;
}

interface USB {
  requestDevice(options: USBDeviceRequestOptions): Promise<USBDevice>;
}

interface USBDevice {
  opened: boolean;
  configuration: USBConfiguration | null;
  open(): Promise<void>;
  selectConfiguration(index: number): Promise<void>;
  claimInterface(index: number): Promise<void>;
  transferOut(endpoint: number, data: BufferSource): Promise<USBOutTransferResult>;
  transferIn(endpoint: number, length: number): Promise<USBInTransferResult>;
  close(): Promise<void>;
}

interface USBDeviceRequestOptions { filters: USBDeviceFilter[]; }
interface USBDeviceFilter {
  vendorId?: number; productId?: number; classCode?: number;
  subclassCode?: number; protocolCode?: number; serialNumber?: string;
}
interface USBConfiguration { configurationValue: number; }
interface USBOutTransferResult { status: string; bytesWritten: number; }
interface USBInTransferResult { status: string; data?: DataView; }
