import { useTableQuery } from "@/hooks/useTableQuery";
import { COUPONS_TABLE_QUERY_KEY } from "..";
import { fetchCouponsClient } from "../services/coupons";

export const useGetCoupons = () => {
  return useTableQuery({
    queryKey: [COUPONS_TABLE_QUERY_KEY],
    fetchFn: fetchCouponsClient,
  });
};
