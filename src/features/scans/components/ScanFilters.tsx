import React, { useState, useEffect } from "react";
import { Input, Select, Form } from "antd";
import { useDebounce } from "../../../shared/hooks/useDebounce";
import { ScanStatus } from "../../../types";

const { Option } = Select;

interface Props {
  filterIp: string;
  filterStatus?: ScanStatus;
  setFilterIp: (ip: string) => void;
  setFilterStatus: (status?: ScanStatus) => void;
}

export const ScanFilters: React.FC<Props> = ({
  filterIp,
  filterStatus,
  setFilterIp,
  setFilterStatus,
}) => {
  const [localIp, setLocalIp] = useState(filterIp);

  const debouncedSetIp = useDebounce(setFilterIp, 500);

  useEffect(() => {
    debouncedSetIp(localIp);
  }, [localIp, debouncedSetIp]);

  return (
    <Form layout="inline" style={{ marginBottom: 16 }}>
      <Form.Item>
        <Input
          placeholder="Фильтр по IP"
          value={localIp}
          onChange={(e) => setLocalIp(e.target.value)}
          style={{ width: 160 }}
        />
      </Form.Item>
      <Form.Item>
        <Select
          placeholder="Фильтр по статусу"
          value={filterStatus}
          onChange={(v) => setFilterStatus(v as ScanStatus)}
          style={{ width: 160 }}
          allowClear
        >
          {Object.values(ScanStatus).map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};
