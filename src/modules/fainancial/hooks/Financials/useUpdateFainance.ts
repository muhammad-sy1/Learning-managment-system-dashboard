import { jsonToFormData } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { FAINANCIAL_TABLE_QUERY_KEY } from "../.."; // Update constant
import { editFinancialSchema } from "../../schemas/Fainancial/editFinancialSchema";
import { updateSection } from "../../services/financial";

export default function useUpdateFainance() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.SectionPage"); // Update translation key

  return useMutation({
    mutationFn: ({
      id,
      sectionData,
    }: {
      id: number | string;
      sectionData: Partial<editFinancialSchema>; // Changed to FormData for file uploads
    }) => {
      const formData = jsonToFormData(sectionData);
      formData.append("_method", "PUT");
      return updateSection(id, formData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FAINANCIAL_TABLE_QUERY_KEY] });
      toast.success(t("updated")); // Added success variant
    },
    onError: (error) => {
      toast.error(error.message); // Added error variant
    },
  });
}
