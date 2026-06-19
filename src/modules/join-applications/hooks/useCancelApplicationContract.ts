import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { APPLICATION_CONTRACTS_QUERY_KEY } from "..";
import { cancelApplicationContract } from "../services/applications";

export default function useCancelApplicationContract() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.applicationsPage.contracts");

  return useMutation({
    mutationFn: ({ id }: { id: number | string }) =>
      cancelApplicationContract(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [APPLICATION_CONTRACTS_QUERY_KEY],
      });
      queryClient.invalidateQueries({
        queryKey: [APPLICATION_CONTRACTS_QUERY_KEY, String(variables.id)],
      });
      toast.success(t("cancelSuccess"));
    },
    onError: (error) => {
      toast.error(error.message || t("cancelError"));
    },
  });
}
