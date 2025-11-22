import { QueryKey, useQueryClient, useMutation } from "@tanstack/react-query";
import { message } from "antd";
import { deleteMultipleScans } from "../../../api/scans";

export const useBulkDeleteScan = (queryKey: QueryKey, onAfter?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number[]>({
    mutationFn: async (ids) => {
      try {
        await deleteMultipleScans(ids);
      } catch (err: any) {
        if (err?.response?.data?.failedIds) {
          const failedIds: number[] = err.response.data.failedIds;
          message.warning(`Не удалось удалить записи: ${failedIds.join(", ")}`);
        } else {
          throw err;
        }
      }
    },
    onSuccess: () => {
      message.success("Выбранные сканы удалены");
      if (onAfter) onAfter();
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      message.error(error?.message || "Ошибка при удалении выбранных сканов");
    },
  });
};
