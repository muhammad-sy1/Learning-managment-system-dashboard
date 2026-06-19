import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ZONES_TABLE_QUERY_KEY } from "..";
import { createZone } from "../services/zones";

export default function useCreateZone() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.ZonePage");

  return useMutation({
    mutationFn: createZone,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ZONES_TABLE_QUERY_KEY] });
      toast(t("created"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}
