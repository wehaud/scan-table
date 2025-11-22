import { useState, useCallback, useMemo } from "react";
import type { TableProps } from "antd";
import { Scan } from "../../../types";

type RowSelectionType = NonNullable<TableProps<Scan>["rowSelection"]>;

export const useScanSelection = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }, []);

  const clearSelection = useCallback(() => setSelectedIds([]), []);

  const onRow = useCallback(
    (record: Scan) => ({
      onClick: () => toggleSelection(record.id),
    }),
    [toggleSelection]
  );

  const rowSelection: RowSelectionType = useMemo(
    () => ({
      type: "checkbox",
      selectedRowKeys: selectedIds,
      onChange: (keys) => setSelectedIds(keys as number[]),
    }),
    [selectedIds]
  );

  return {
    selectedIds,
    toggleSelection,
    clearSelection,
    rowSelection,
    onRow,
  };
};
