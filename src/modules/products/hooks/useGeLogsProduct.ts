import { useQuery } from "@tanstack/react-query";
import { PRODUCT_LOGS_TABLE_QUERY_KEY } from "..";
import { fetchLogsProductClient } from "../services/logsProduct";

export const useGeLogsProduct = (productId: string | null) => {
  return useQuery({
    queryKey: [PRODUCT_LOGS_TABLE_QUERY_KEY, productId],
    queryFn: () => fetchLogsProductClient(productId),
    enabled: !!productId,
  });
};
