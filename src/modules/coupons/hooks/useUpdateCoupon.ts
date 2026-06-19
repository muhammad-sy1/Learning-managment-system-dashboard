import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { COUPON_BY_ID_QUERY_KEY, COUPONS_TABLE_QUERY_KEY } from "..";
import { EditCouponSchema } from "../schemas/editCouponSchema";
import { updateCoupon } from "../services/coupons";

export default function useUpdateCoupon() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.CouponsPage.messages");

  return useMutation({
    mutationFn: ({
      id,
      couponData,
    }: {
      id: number | string;
      couponData: Partial<EditCouponSchema>;
    }) => {
      return updateCoupon(id, couponData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COUPONS_TABLE_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [COUPON_BY_ID_QUERY_KEY] });
      toast(t("updateSuccess"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}
