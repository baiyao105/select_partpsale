import { useQuery } from "@tanstack/react-query";
import { queryDevice } from "../api/device";

export function useDeviceQuery(code: string | null) {
  return useQuery({
    queryKey: ["device", code],
    queryFn: () => queryDevice(code!),
    enabled: !!code,
    retry: false,
    gcTime: 0,
  });
}
