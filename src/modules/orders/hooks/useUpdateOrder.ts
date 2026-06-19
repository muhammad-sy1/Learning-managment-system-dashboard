import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { updateOrderStatus } from "../services/orders";
import { ORDERS_TABLE_QUERY_KEY } from "..";
import { EditStatusOrderSchema } from "../schemas/editStatusOrderSchema";


export default function useUpdateOrder() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.OrdersPage");

  return useMutation({
    mutationFn: ({
      id,
      orderData,
    }: {
      id: number | string;
      orderData: EditStatusOrderSchema;
    }) => updateOrderStatus(id, orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ORDERS_TABLE_QUERY_KEY] });
      toast(t("messages.updateSuccess"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}
