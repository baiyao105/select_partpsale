import { useState, useCallback } from "react";

function decode(data: DataView | undefined): string {
  return data ? new TextDecoder().decode(data) : "";
}

export function useADB() {
  const [error, setError] = useState<string | null>(null);

  const adbRead = useCallback(async (): Promise<string | null> => {
    if (!navigator.usb) {
      setError("浏览器不支持WebUSB");
      return null;
    }
    try {
      const mod: any = await import("webadb");
      const Adb = mod.default || mod;

      const transport = await Adb.WebUSB.Transport.open();
      const device = await transport.connectAdb("host::");
      const stream = await device.shell("getprop ro.boot.bindnumber");

      let result = "";
      let resp = await stream.receive();

      while (resp.cmd === "WRTE") {
        await stream.send("OKAY");
        result += decode(resp.data);
        resp = await stream.receive();
      }

      const match = result.match(/\[(.*?)\]/);
      const val = match ? match[1] : result.trim();

      if (val && !val.includes("ERROR")) {
        setError(null);
        return val;
      }
      setError("未找到绑定号");
      return null;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "ADB错误";
      if (err instanceof Error && err.name !== "NotFoundError") setError(msg);
      return null;
    }
  }, []);

  return { adbRead, error };
}
