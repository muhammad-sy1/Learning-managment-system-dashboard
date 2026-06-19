import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ZONES_TABLE_QUERY_KEY } from "..";
import { IUpdateZonePayload } from "../types/zone";
import { updateZone } from "../services/zones";

export default function useUpdateZone() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.ZonePage");

  return useMutation({
    mutationFn: ({
      id,
      provinceData,
    }: {
      id: number | string;
      provinceData: IUpdateZonePayload;
    }) => {
      return updateZone(id, provinceData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ZONES_TABLE_QUERY_KEY] });
      toast(t("updated"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}
