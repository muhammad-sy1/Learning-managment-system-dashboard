import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { TApplicationStatusPayload } from "../types/applications";
import { updateApplicationsStatus } from "../services/applications";
import { APPLICATIONS_TABLE_QUERY_KEY } from "..";

export default function useUpdateApplication() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.OrdersPage");

  return useMutation({
    mutationFn: ({
      id,
      applicationData,
    }: {
      id: number | string;
      applicationData: TApplicationStatusPayload;
    }) => updateApplicationsStatus(id, applicationData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [APPLICATIONS_TABLE_QUERY_KEY],
      });
      toast(t("messages.updateSuccess"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}
