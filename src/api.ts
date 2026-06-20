import { CFG, HTTP_ERRORS } from './config';
import type { ApiResponse, InsuranceResponse } from './types';

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

export async function queryInsurance(sn: string): Promise<InsuranceResponse | null> {
  const ac = new AbortController();
  const id = setTimeout(() => ac.abort(), CFG.TIMEOUT);
  try {
    const url = `https://screencard.eebbk.com/apireserve/api/insurance/get?productSn=${sn}&serviceType=EXTEND&appId=${CFG.APP_ID}&unionId=${CFG.UNION_ID}&openId=${CFG.OPEN_ID}`;
    const resp = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: ac.signal,
    });
    if (!resp.ok) {
      return null;
    }
    const data = await resp.json();
    if (data.code === '000001' && data.data) {
      return data;
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(id);
  }
}

export function extractBindNumber(text: string): string {
  const match = text.match(/\/d\/([a-zA-Z0-9]+)/);
  return match ? match[1] : text;
}
