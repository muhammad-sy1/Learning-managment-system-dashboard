import { useTableQuery } from "@/hooks/useTableQuery";
import { ORDERS_LOG_TABLE_QUERY_KEY } from "..";
import { fetchOrdersLogClient } from "../services/orders";

export const useGetLogOrders = () => {
  return useTableQuery({
    queryKey: [ORDERS_LOG_TABLE_QUERY_KEY],
    fetchFn: fetchOrdersLogClient,
  });
};
