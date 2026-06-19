import { useState, useCallback } from 'react';

export function useADB() {
  const [error, setError] = useState<string | null>(null);

  const adbRead = useCallback(async (): Promise<string | null> => {
    if (!navigator.usb) {
      setError('浏览器不支持WebUSB');
      return null;
    }
    try {
      const dev = await navigator.usb.requestDevice({ filters: [] });
      await dev.open();
      if (!dev.configuration) await dev.selectConfiguration(1);
      await dev.claimInterface(0);

      const enc = new TextEncoder();
      const dec = new TextDecoder();
      await dev.transferOut(1, enc.encode('getprop ro.boot.bindnumber\n'));

      let res = '';
      while (true) {
        const r = await dev.transferIn(1, 4096);
        if (r.status !== 'ok') break;
        const chunk = dec.decode(r.data);
        res += chunk;
        if (chunk.includes('\nOK') || chunk.includes('\nERROR')) break;
      }

      const match = res.match(/\[(.*?)\]/);
      const val = match ? match[1] : res.trim();
      await dev.close();

      if (val && !val.includes('ERROR')) {
        setError(null);
        return val;
      }
      setError('未找到绑定号');
      return null;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'ADB错误';
      if (err instanceof Error && err.name !== 'NotFoundError') setError(msg);
      return null;
    }
  }, []);

  return { adbRead, error };
}
