import { request } from "./client";
import { CFG } from "../config";
import type { InsuranceResponse } from "../types";

export async function queryInsurance(
  sn: string,
): Promise<InsuranceResponse> {
  const result = await request<InsuranceResponse["data"]>({
    url: CFG.INSURANCE_API,
    params: {
      productSn: sn,
      serviceType: "EXTEND",
    },
  });

  if (String(result.code) === "000001" && result.data) {
    return result as unknown as InsuranceResponse;
  }
  return result as unknown as InsuranceResponse;
}
