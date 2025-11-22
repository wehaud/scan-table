import { useMutation, useQueryClient } from "@tanstack/react-query";
import { message } from "antd";
import { deleteScan } from "../../../api/scans";

export const useDeleteScan = (queryKey: unknown[]) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteScan(id),
    onSuccess: () => {
      message.success("Скан удален");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => message.error("Ошибка при удалении скана"),
  });
};