import React, { useState, useEffect, useMemo } from "react";
import { Input, Select, Form } from "antd";
import { ScanStatus } from "../types";
import debounce from "lodash.debounce";

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

  const debouncedSetIp = useMemo(
    () => debounce((val: string) => setFilterIp(val), 500),
    [setFilterIp]
  );

  useEffect(() => {
    debouncedSetIp(localIp);
    return () => {
      debouncedSetIp.cancel();
    };
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
          <Option value={ScanStatus.Active}>Active</Option>
          <Option value={ScanStatus.Inactive}>Inactive</Option>
        </Select>
      </Form.Item>
    </Form>
  );
};
