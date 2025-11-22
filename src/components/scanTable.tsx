import { useState, useEffect } from "react";
import { Table, Button, Popconfirm, message } from "antd";
import { observer } from "mobx-react-lite";
import { selectedStore } from "../stores/selectedStore";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Scan, ScanStatus } from "../types";
import { ColumnsType } from "antd/es/table";
import { ScanFilters } from "./scanFilters";
import { useNavigate } from "react-router-dom";

const fetchScans = async (
  page: number,
  pageSize: number,
  ip?: string,
  status?: ScanStatus
) => {
  const params = {
    page,
    pageSize,
    ...(ip && { ip }),
    ...(status && { status }),
  };
  const { data } = await axios.get("http://localhost:5000/scans", { params });
  return data;
};

const deleteScan = async (id: number) => {
  await axios.delete(`http://localhost:5000/scans/${id}`);
};

const deleteMultipleScans = async (ids: number[]) => {
  await axios.delete(`http://localhost:5000/scans`, { data: { ids } });
};

export const ScanTable = observer(() => {
  const navigate = useNavigate();
  const [filterIp, setFilterIp] = useState("");
  const [filterStatus, setFilterStatus] = useState<ScanStatus>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const queryClient = useQueryClient();

  useEffect(() => {
    setPage(1);
  }, [filterIp, filterStatus]);

  const { data, isLoading } = useQuery({
    queryKey: ["scans", page, pageSize, filterIp, filterStatus],
    queryFn: () => fetchScans(page, pageSize, filterIp, filterStatus),
    staleTime: 5000,
    placeholderData: (prev) => prev,
  });

  const mutation = useMutation({
    mutationFn: (id: number) => deleteScan(id),
    onSuccess: () => {
      message.success("Скан удален");
      queryClient.invalidateQueries({
        queryKey: ["scans", page, pageSize, filterIp, filterStatus],
      });
    },
    onError: () => message.error("Ошибка при удалении скана"),
  });

  const multiDeleteMutation = useMutation({
    mutationFn: (ids: number[]) => deleteMultipleScans(ids),
    onSuccess: () => {
      selectedStore.clear();
      message.success("Выбранные сканы удалены");
      queryClient.invalidateQueries({
        queryKey: ["scans", page, pageSize, filterIp, filterStatus],
      });
    },
    onError: () => message.error("Ошибка при удалении выбранных сканов"),
  });

  const columns: ColumnsType<Scan> = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "IP", dataIndex: "ip", key: "ip" },
    { title: "Status", dataIndex: "status", key: "status" },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d: string) => d,
    },
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
          onConfirm={() => mutation.mutate(record.id)}
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
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 16,
        }}
      >
        <ScanFilters
          filterIp={filterIp}
          filterStatus={filterStatus}
          setFilterIp={setFilterIp}
          setFilterStatus={setFilterStatus}
        />
        {selectedStore.selectedIds.length > 0 && (
          <>
            <Popconfirm
              title="Удалить выбранные записи?"
              onConfirm={() =>
                multiDeleteMutation.mutate(selectedStore.selectedIds)
              }
            >
              <Button danger>Удалить выбранные</Button>
            </Popconfirm>

            <Button onClick={() => selectedStore.clear()}>
              Снять выделение
            </Button>
          </>
        )}
      </div>

      <Table
        rowKey="id"
        dataSource={data?.data}
        columns={columns}
        loading={isLoading}
        rowSelection={{
          type: "checkbox",
          selectedRowKeys: selectedStore.selectedIds,
          onChange: (selectedRowKeys: React.Key[]) => {
            selectedStore.setSelectedIds(selectedRowKeys as number[]);
          },
        }}
        className="clickable"
        onRow={(record) => ({
          onClick: (e) => {
            const target = e.target as HTMLElement;
            if (target.closest("button")) return;
            const selectedIds = [...selectedStore.selectedIds];
            const index = selectedIds.indexOf(record.id);
            if (index >= 0) {
              selectedIds.splice(index, 1);
            } else {
              selectedIds.push(record.id);
            }
            selectedStore.setSelectedIds(selectedIds);
          },
        })}
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
});
