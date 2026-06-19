import { jsonToFormData } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { TRANSACTIONS_TABLE_QUERY_KEY } from "../.."; // Update constant
import { AddTransactionSchema } from "../../schemas/Transactions/addTransactionSchema";
import { createTransaction } from "../../services/transaction";

export default function useCreateTransaction() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.SectionPage"); // Update translation key

  return useMutation({
    mutationFn: (data: AddTransactionSchema) => {
      const formData = jsonToFormData(data);
      return createTransaction(formData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TRANSACTIONS_TABLE_QUERY_KEY],
      });
      toast.success(t("created")); // Added success variant
    },
    onError: (error) => {
      toast.error(error.message); // Added error variant
    },
  });
}
