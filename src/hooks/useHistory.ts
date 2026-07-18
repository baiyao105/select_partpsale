import { useState, useCallback } from "react";

const STORAGE_KEY = "serial_query_history";
const COOKIE_KEY = "serial_query_history";
const MAX = 20;

function migrateFromCookie(): string[] {
  try {
    const raw = document.cookie
      .split("; ")
      .find((r) => r.startsWith(COOKIE_KEY + "="));
    if (!raw) return [];
    const val = decodeURIComponent(raw.slice(COOKIE_KEY.length + 1));
    const data = JSON.parse(val);
    document.cookie = `${COOKIE_KEY}=; path=/; max-age=0`;
    return data;
  } catch {
    return [];
  }
}

function getHistory(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    const migrated = migrateFromCookie();
    if (migrated.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
    }
    return migrated;
  } catch {
    return [];
  }
}

function setHistory(list: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function useHistory() {
  const [history, setHistoryState] = useState<string[]>(() => getHistory());

  const add = useCallback((code: string) => {
    if (!code.trim()) return;
    setHistoryState((prev) => {
      const next = [code, ...prev.filter((c) => c !== code)].slice(0, MAX);
      setHistory(next);
      return next;
    });
  }, []);

  const remove = useCallback((code: string) => {
    setHistoryState((prev) => {
      const next = prev.filter((c) => c !== code);
      setHistory(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setHistoryState([]);
    setHistory([]);
  }, []);

  return { history, add, remove, clearAll };
}
