import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { assignOrder } from "../services/orders";
import { ORDER_BY_ID_TABLE_QUERY_KEY } from "..";

export default function useAssignOrder() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.OrdersPage");

  return useMutation({
    mutationFn: ({
      orderId,
      delivery_id,
    }: {
      orderId: number | string;
      delivery_id: number | string;
    }) => assignOrder(orderId, { delivery_id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDER_BY_ID_TABLE_QUERY_KEY] });
      toast(t("messages.updateSuccess"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}
