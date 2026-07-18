import { request } from "./client";
import type { InsuranceResponse } from "../types";

export async function queryInsurance(
  sn: string,
): Promise<InsuranceResponse | null> {
  try {
    const result = await request<InsuranceResponse["data"]>({
      url: "https://screencard.eebbk.com/apireserve/api/insurance/get",
      params: {
        productSn: sn,
        serviceType: "EXTEND",
      },
    });

    if (String(result.code) === "000001" && result.data) {
      return result as unknown as InsuranceResponse;
    }
    return null;
  } catch {
    return null;
  }
}
