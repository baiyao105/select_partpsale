import { request } from "./client";
import { CFG } from "../config";
import type { QueryData } from "../types";

export async function queryDevice(code: string): Promise<QueryData> {
  const res = await request<QueryData>({
    url: CFG.API,
    params: { queryParam: code },
  });

  if (res.data && Object.keys(res.data).length > 0) {
    return res.data;
  }

  throw new Error(`未找到串码「${code}」的相关信息`);
}

export function extractBindNumber(text: string): string {
  const match = text.match(/\/d\/([a-zA-Z0-9]+)/);
  return match ? match[1] : text;
}
