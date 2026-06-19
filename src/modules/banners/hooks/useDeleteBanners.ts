import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { BANNERS_TABLE_QUERY_KEY } from "..";
import { deleteBanner } from "../services/banners";

export default function useDeleteBanners() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.BannersPage.messages");

  return useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [BANNERS_TABLE_QUERY_KEY] });
      toast(t("deleteSuccess"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}
