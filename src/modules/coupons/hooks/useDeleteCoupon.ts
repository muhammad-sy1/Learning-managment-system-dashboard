import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { COUPONS_TABLE_QUERY_KEY } from "..";
import { deleteCoupon } from "../services/coupons";

export default function useDeleteCoupon() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.CouponsPage.messages");

  return useMutation({
    mutationFn: deleteCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COUPONS_TABLE_QUERY_KEY] });
      toast(t("deleteSuccess"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}
