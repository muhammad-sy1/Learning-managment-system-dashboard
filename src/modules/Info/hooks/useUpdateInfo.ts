import { jsonToFormData } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { Info_QUERY_KEY } from "..";
import { UpdateInfoSchema } from "../schemas/UpdateInfoSchema";
import { UpdateInfoClient } from "../services/info";

export default function useUpdateInfo() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.InfoPage.messages");

  return useMutation({
    mutationFn: ({ payload }: { payload: UpdateInfoSchema }) => {
      const formData = jsonToFormData(payload);
      formData.append("_method", "PUT");
      return UpdateInfoClient(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [Info_QUERY_KEY],
      });
      toast(t("updateSuccess"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}
