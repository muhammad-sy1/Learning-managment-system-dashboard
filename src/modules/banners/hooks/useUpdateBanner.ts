import { jsonToFormData } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { BANNERS_TABLE_QUERY_KEY } from "..";
import { EditBannerSchema } from "../schemas/editBannerSchema";
import { updateBanner } from "../services/banners";

export default function useUpdateBanner() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.BannersPage.messages");

  return useMutation({
    mutationFn: ({
      id,
      bannerData,
    }: {
      id: number | string;
      bannerData:  Partial<EditBannerSchema>;
    }) => {
      const formData = jsonToFormData(bannerData);
      formData.append("_method", "PUT");
      return updateBanner(id, formData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BANNERS_TABLE_QUERY_KEY] });
      toast(t("updateSuccess"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}
