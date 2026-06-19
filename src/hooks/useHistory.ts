import { useState, useCallback } from 'react';

const COOKIE_KEY = 'serial_query_history';
const MAX = 20;

function getCookies(): string[] {
  try {
    const raw = document.cookie.split('; ').find(r => r.startsWith(COOKIE_KEY + '='));
    if (!raw) return [];
    const val = decodeURIComponent(raw.slice(COOKIE_KEY.length + 1));
    return JSON.parse(val);
  } catch { return []; }
}

function setCookies(list: string[]) {
  const val = encodeURIComponent(JSON.stringify(list));
  document.cookie = `${COOKIE_KEY}=${val}; path=/; max-age=31536000`;
}

export function useHistory() {
  const [history, setHistory] = useState<string[]>(() => getCookies());

  const add = useCallback((code: string) => {
    if (!code.trim()) return;
    setHistory(prev => {
      const next = [code, ...prev.filter(c => c !== code)].slice(0, MAX);
      setCookies(next);
      return next;
    });
  }, []);

  const remove = useCallback((code: string) => {
    setHistory(prev => {
      const next = prev.filter(c => c !== code);
      setCookies(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setHistory([]);
    setCookies([]);
  }, []);

  return { history, add, remove, clearAll };
}
