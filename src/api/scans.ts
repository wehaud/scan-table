import axios from "axios";
import { Scan, ScanStatus } from "../types";

interface FetchScansResponse {
  data: Scan[];
  total: number;
}

const api = axios.create({
  baseURL: "http://localhost:5000",
});

export const fetchScans = async (
  page: number,
  pageSize: number,
  ip?: string,
  status?: ScanStatus
): Promise<FetchScansResponse> => {
  const params = {
    page,
    pageSize,
    ...(ip && { ip }),
    ...(status && { status }),
  };
  try {
    const { data } = await api.get<FetchScansResponse>("/scans", { params });
    return data;
  } catch (err: any) {
    throw new Error(
      err?.response?.data?.message || "Ошибка при загрузке сканов"
    );
  }
};

export const deleteScan = async (id: number): Promise<void> => {
  await api.delete(`/scans/${id}`);
};

export const deleteMultipleScans = async (ids: number[]): Promise<void> => {
  await api.delete("/scans", { data: { ids } });
};
