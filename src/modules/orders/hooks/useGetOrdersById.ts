import { useQuery } from "@tanstack/react-query";
import { ORDER_BY_ID_TABLE_QUERY_KEY } from "..";
import { fetchOrderByIdClient } from "../services/orders";
import { OrderType } from "../types/orders";

export const useGetOrdersById = ({
  id,
  orderType,
}: {
  id: number | string;
  orderType?: OrderType;
}) => {
  return useQuery({
    queryKey: [ORDER_BY_ID_TABLE_QUERY_KEY, String(id)],
    queryFn: () => fetchOrderByIdClient(id, orderType),
  });
};
