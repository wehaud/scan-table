import { useState, useEffect } from "react";
import { ScanStatus } from "../../../types";

export const useScanTableState = () => {
  const [filterIp, setFilterIp] = useState("");
  const [filterStatus, setFilterStatus] = useState<ScanStatus>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => setPage(1), [filterIp, filterStatus]);

  return {
    filterIp,
    setFilterIp,
    filterStatus,
    setFilterStatus,
    page,
    setPage,
    pageSize,
    setPageSize,
  };
};
