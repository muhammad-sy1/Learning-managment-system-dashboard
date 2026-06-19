
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { COUPONS_TABLE_QUERY_KEY } from "..";
import { createCoupon } from "../services/coupons";

export default function useCreateCoupon() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.CouponsPage");

  return useMutation({
    mutationFn: createCoupon, 
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [COUPONS_TABLE_QUERY_KEY] });
      toast(t("messages.createSuccess"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}
