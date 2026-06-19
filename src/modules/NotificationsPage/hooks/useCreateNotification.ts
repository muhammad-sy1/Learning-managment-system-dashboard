// hooks/useCreateProvince.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Notification_TABLE_QUERY_KEY } from "..";
import { createNotification } from "../services/notifications";

export default function useCreateNotification() {
  const queryClient = useQueryClient();
  const t = useTranslations("Notifications");

  return useMutation({
    mutationFn: createNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [Notification_TABLE_QUERY_KEY],
      });
      toast(t("created"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}
