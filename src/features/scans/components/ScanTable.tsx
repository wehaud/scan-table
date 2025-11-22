import { Table, Button, Popconfirm } from "antd";
import { useNavigate } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { useScans } from "../hooks/useScans";
import { useDeleteScan } from "../hooks/useDeleteScan";
import { useBulkDeleteScan } from "../hooks/useBulkDeleteScan";
import { useScanTableState } from "../hooks/useScanTableState";
import { useScanSelection } from "../hooks/useScanSelection";
import { Scan } from "../../../types";
import { ScanTableActions } from "./ScanTableActions";

export const ScanTable = () => {
  const navigate = useNavigate();

  const {
    filterIp,
    setFilterIp,
    filterStatus,
    setFilterStatus,
    page,
    setPage,
    pageSize,
    setPageSize,
  } = useScanTableState();

  const { selectedIds, clearSelection, rowSelection, onRow } =
    useScanSelection();

  const { data, isLoading } = useScans({
    page,
    pageSize,
    ip: filterIp,
    status: filterStatus,
  });

  const queryKey = ["scans", page, pageSize, filterIp, filterStatus];
  const deleteMutation = useDeleteScan(queryKey);
  const multiDeleteMutation = useBulkDeleteScan(queryKey, clearSelection);

  const columns: ColumnsType<Scan> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "IP", dataIndex: "ip", key: "ip" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Created At", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "Product",
      key: "product",
      render: (_: any, record: Scan) => (
        <Button
          type="link"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/ip/${record.ip}`);
          }}
        >
          Перейти к продукту
        </Button>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Scan) => (
        <Popconfirm
          title="Удалить запись?"
          onConfirm={() => deleteMutation.mutate(record.id)}
        >
          <Button danger size="small">
            Удалить
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <ScanTableActions
        filterIp={filterIp}
        setFilterIp={setFilterIp}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        hasSelection={selectedIds.length > 0}
        onDeleteSelected={() => multiDeleteMutation.mutate(selectedIds)}
        onClearSelection={clearSelection}
      />

      <Table
        rowKey="id"
        dataSource={data?.data}
        columns={columns}
        loading={isLoading}
        rowSelection={rowSelection}
        onRow={onRow}
        className="clickable"
        pagination={{
          current: page,
          pageSize,
          total: data?.total,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
      />
    </>
  );
};
