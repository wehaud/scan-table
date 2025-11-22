import { useQuery } from "@tanstack/react-query";
import { ScanStatus } from "../../../types";
import { fetchScans } from "../../../api/scans";

interface UseScansParams {
  page: number;
  pageSize: number;
  ip?: string;
  status?: ScanStatus;
}

export const useScans = ({ page, pageSize, ip, status }: UseScansParams) => {
  return useQuery({
    queryKey: ["scans", page, pageSize, ip, status],
    queryFn: () => fetchScans(page, pageSize, ip, status),
    staleTime: 5000,
    placeholderData: (prev) => prev,
  });
};
