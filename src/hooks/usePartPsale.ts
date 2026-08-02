import { useQuery } from "@tanstack/react-query";
import { queryDevice } from "../api/device";
import { queryInsurance } from "../api/insurance";
import { mergeData } from "../utils/mergeData";
import type { QueryData } from "../types";

interface QueryResult {
  data: QueryData | undefined;
  rawDevice: Awaited<ReturnType<typeof queryDevice>> | undefined;
  rawInsurance: Awaited<ReturnType<typeof queryInsurance>> | null | undefined;
}

export function usePartPsale(code: string | null) {
  return useQuery<QueryResult>({
    queryKey: ["partPsale", code],
    queryFn: async () => {
      const [deviceRes, insuranceRes] = await Promise.allSettled([
        queryDevice(code!),
        queryInsurance(code!),
      ]);

      const deviceData =
        deviceRes.status === "fulfilled" ? deviceRes.value?.data : undefined;
      const insuranceData =
        insuranceRes.status === "fulfilled" ? insuranceRes.value : null;

      return {
        data: mergeData(deviceData, insuranceData),
        rawDevice:
          deviceRes.status === "fulfilled" ? deviceRes.value : undefined,
        rawInsurance:
          insuranceRes.status === "fulfilled" ? insuranceRes.value : null,
      };
    },
    enabled: !!code,
    retry: false,
    gcTime: 0,
  });
}
