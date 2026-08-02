import { useQuery } from "@tanstack/react-query";
import { queryDevice } from "../api/device";
import { queryInsurance } from "../api/insurance";
import { mergeData } from "../utils/mergeData";
import type { QueryData } from "../types";

interface QueryResult {
  data: QueryData | undefined;
  insuranceNotSupported: boolean;
}

export function usePartPsale(code: string | null) {
  return useQuery<QueryResult>({
    queryKey: ["partPsale", code],
    queryFn: async () => {
      const [deviceRes, insuranceRes] = await Promise.allSettled([
        queryDevice(code!),
        queryInsurance(code!),
      ]);

      if (deviceRes.status === "rejected") {
        throw deviceRes.reason;
      }

      const insurance =
        insuranceRes.status === "fulfilled" ? insuranceRes.value : null;

      return {
        data: mergeData(deviceRes.value, insurance),
        insuranceNotSupported: !!insurance?.notSupported,
      };
    },
    enabled: !!code,
    retry: false,
    gcTime: 0,
  });
}
