import React from "react";
import { Button, Popconfirm } from "antd";

interface Props {
  hasSelection: boolean;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
}

export const SelectionActions: React.FC<Props> = ({
  hasSelection,
  onDeleteSelected,
  onClearSelection,
}) => {
  if (!hasSelection) return null;

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Popconfirm
        title="Удалить выбранные записи?"
        onConfirm={onDeleteSelected}
      >
        <Button danger>Удалить выбранные</Button>
      </Popconfirm>
      <Button onClick={onClearSelection}>Снять выделение</Button>
    </div>
  );
};
