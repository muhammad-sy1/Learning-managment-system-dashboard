import { useTableQuery } from "@/hooks/useTableQuery";
import { COUPON_BY_ID_QUERY_KEY } from "..";
import { fetchCouponById } from "../services/coupons";

export const useGetCouponById = (couponId: number) => {
  return useTableQuery({
    queryKey: [COUPON_BY_ID_QUERY_KEY, String(couponId)],
    fetchFn: () => fetchCouponById(couponId),
  });
};
