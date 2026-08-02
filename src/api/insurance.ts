import { request } from "./client";
import { CFG } from "../config";
import type { InsuranceData } from "../types";

export interface InsuranceResult {
  data: InsuranceData | null;
  notSupported?: boolean;
  errorMsg?: string;
}

const INS_CODE_MSG: Record<string, string> = {
  "000004": "未查询到保修信息",
  "100219": "该条码不支持碎屏保",
};

export async function queryInsurance(sn: string): Promise<InsuranceResult> {
  try {
    const res = (await request({
      url: CFG.INSURANCE_API,
      params: { productSn: sn, serviceType: "EXTEND" },
    })) as unknown as {
      code: string;
      data: InsuranceData | null;
      desc: string;
    };

    if (String(res.code) === "000001" && res.data) {
      return { data: res.data };
    }

    return {
      data: null,
      notSupported: res.code === "100219",
      errorMsg: INS_CODE_MSG[res.code] || res.desc || "保修查询失败",
    };
  } catch {
    return { data: null, errorMsg: "保修信息查询超时" };
  }
}
