import { useQuery } from "@tanstack/react-query";
import { queryInsurance } from "../api/insurance";

export function useInsuranceQuery(code: string | null) {
  return useQuery({
    queryKey: ["insurance", code],
    queryFn: () => queryInsurance(code!),
    enabled: !!code,
    retry: false,
    gcTime: 0,
  });
}
