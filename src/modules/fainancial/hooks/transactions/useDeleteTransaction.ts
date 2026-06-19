import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { TRANSACTIONS_TABLE_QUERY_KEY } from "../.."; // Update constant
import { deleteTransaction } from "../../services/transaction";

export default function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.SectionPage"); // Update translation key

  return useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TRANSACTIONS_TABLE_QUERY_KEY],
      });
      toast.success(t("deleted")); // Added success variant
    },
    onError: (error) => {
      toast.error(error.message); // Added error variant
    },
  });
}
