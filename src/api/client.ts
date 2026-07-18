import { CFG, HTTP_ERRORS } from "../config";

interface RequestOptions {
  url: string;
  params?: Record<string, string>;
  method?: "GET" | "POST";
  signal?: AbortSignal;
}

export interface ApiResponse<T> {
  code?: number;
  msg?: string;
  data?: T;
}

export async function request<T>(
  options: RequestOptions,
): Promise<ApiResponse<T>> {
  const { url, params = {}, method = "GET", signal } = options;

  const ac = new AbortController();
  const id = setTimeout(() => ac.abort(), CFG.TIMEOUT);

  try {
    const queryString = new URLSearchParams({
      ...params,
      appId: CFG.APP_ID,
      unionId: CFG.UNION_ID,
      openId: CFG.OPEN_ID,
    }).toString();

    const fullUrl = url.includes("?")
      ? `${url}&${queryString}`
      : `${url}?${queryString}`;

    const headers: Record<string, string> = { Accept: "application/json" };
    if (method === "POST") {
      headers["Content-Type"] = "application/json";
    }

    const resp = await fetch(fullUrl, {
      method,
      headers,
      signal: AbortSignal.any(signal ? [signal, ac.signal] : [ac.signal]),
    });

    if (!resp.ok) {
      throw new Error(HTTP_ERRORS[resp.status] || `HTTP ${resp.status}`);
    }

    try {
      return await resp.json();
    } catch {
      throw new Error(
        `Expected JSON response but received: ${resp.headers.get("content-type") || "unknown"}`,
      );
    }
  } finally {
    clearTimeout(id);
  }
}
