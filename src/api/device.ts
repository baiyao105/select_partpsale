import { request } from "./client";
import type { ApiResponse } from "./client";
import { CFG } from "../config";
import type { QueryData } from "../types";

export async function queryDevice(
  code: string,
): Promise<ApiResponse<QueryData>> {
  return request<QueryData>({
    url: CFG.API,
    params: { queryParam: code },
  });
}

export function extractBindNumber(text: string): string {
  const match = text.match(/\/d\/([a-zA-Z0-9]+)/);
  return match ? match[1] : text;
}
