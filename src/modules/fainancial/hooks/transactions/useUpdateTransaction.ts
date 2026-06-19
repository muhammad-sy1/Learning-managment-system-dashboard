import { jsonToFormData } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { TRANSACTIONS_TABLE_QUERY_KEY } from "../.."; // Update constant
import { updateTransaction } from "../../services/transaction";
import { EditTransactionSchema } from "../../schemas/Transactions/editTransactionSchema";

export default function useUpdateTransaction() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.SectionPage"); // Update translation key

  return useMutation({
    mutationFn: ({
      id,
      transactionData,
    }: {
      id: number | string;
      transactionData: Partial<EditTransactionSchema>; // Changed to FormData for file uploads
    }) => {
      const formData = jsonToFormData(transactionData);
      formData.append("_method", "PUT");
      return updateTransaction(id, formData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TRANSACTIONS_TABLE_QUERY_KEY],
      });
      toast.success(t("updated")); // Added success variant
    },
    onError: (error) => {
      toast.error(error.message); // Added error variant
    },
  });
}
