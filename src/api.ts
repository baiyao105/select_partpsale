import { CFG, HTTP_ERRORS } from './config';
import type { ApiResponse } from './types';

export async function queryAPI(q: string): Promise<ApiResponse> {
  const ac = new AbortController();
  const id = setTimeout(() => ac.abort(), CFG.TIMEOUT);
  try {
    const params = new URLSearchParams({
      queryParam: q, appId: CFG.APP_ID, unionId: CFG.UNION_ID, openId: CFG.OPEN_ID,
    });
    const resp = await fetch(CFG.API + '?' + params.toString(), {
      headers: { Accept: 'application/json' },
      signal: ac.signal,
    });
    if (!resp.ok) {
      throw new Error(HTTP_ERRORS[resp.status] || `HTTP ${resp.status}`);
    }
    return resp.json();
  } finally {
    clearTimeout(id);
  }
}

export function extractBindNumber(text: string): string {
  const match = text.match(/\/d\/([a-zA-Z0-9]+)/);
  return match ? match[1] : text;
}
