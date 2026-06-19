import { jsonToFormData } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { BANNERS_TABLE_QUERY_KEY } from "..";
import { AddBannerSchema } from "../schemas/addBannerSchema";
import { createBanner } from "../services/banners";

export default function useCreateBanner({ type }: { type: string }) {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.BannersPage");

  return useMutation({
    mutationFn: (data: AddBannerSchema) => {
      const formData = jsonToFormData(data);
      formData.append("type", type);
      return createBanner(formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BANNERS_TABLE_QUERY_KEY] });
      toast(t("messages.createSuccess"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}
