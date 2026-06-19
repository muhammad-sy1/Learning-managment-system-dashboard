import { useTableQuery } from "@/hooks/useTableQuery";
import { ORDERS_TABLE_QUERY_KEY } from "..";
import { fetchOrdersClient } from "../services/orders";

export const useGetOrders = () => {
  return useTableQuery({
    queryKey: [ORDERS_TABLE_QUERY_KEY],
    fetchFn: fetchOrdersClient,
  });
};
