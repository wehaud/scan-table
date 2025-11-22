import React from "react";
import { ScanStatus } from "../../../types";
import { ScanFilters } from "./ScanFilters";
import { SelectionActions } from "./SelectionActions";

interface Props {
  filterIp: string;
  setFilterIp: (ip: string) => void;
  filterStatus?: ScanStatus;
  setFilterStatus: (status?: ScanStatus) => void;
  hasSelection: boolean;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
}

export const ScanTableActions: React.FC<Props> = ({
  filterIp,
  setFilterIp,
  filterStatus,
  setFilterStatus,
  hasSelection,
  onDeleteSelected,
  onClearSelection,
}) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
    <ScanFilters
      filterIp={filterIp}
      filterStatus={filterStatus}
      setFilterIp={setFilterIp}
      setFilterStatus={setFilterStatus}
    />
    <SelectionActions
      hasSelection={hasSelection}
      onDeleteSelected={onDeleteSelected}
      onClearSelection={onClearSelection}
    />
  </div>
);
