import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ZONES_TABLE_QUERY_KEY } from "..";
import { deleteZone } from "../services/zones";

export default function useDeleteZone() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.ZonePage");

  return useMutation({
    mutationFn: deleteZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ZONES_TABLE_QUERY_KEY] });
      toast(t("deleted"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}
