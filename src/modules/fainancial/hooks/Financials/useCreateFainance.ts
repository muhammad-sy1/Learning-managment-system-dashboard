import { jsonToFormData } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { FAINANCIAL_TABLE_QUERY_KEY } from "../.."; // Update constant
import { addFinancialSchema } from "../../schemas/Fainancial/addFinancialSchema";
import { createSection } from "../../services/financial";

export default function useCreateFainance() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.SectionPage"); // Update translation key

  return useMutation({
    mutationFn: (data: addFinancialSchema ) => {
      const formData = jsonToFormData(data);
      return createSection(formData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FAINANCIAL_TABLE_QUERY_KEY] });
      toast.success(t("created")); // Added success variant
    },
    onError: (error) => {
      toast.error(error.message); // Added error variant
    },
  });
}
