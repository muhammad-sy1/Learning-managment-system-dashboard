import { jsonToFormData } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { SECTIONS_TABLE_QUERY_KEY } from ".."; // Update constant
import { updateSection } from "../services/sections";
import { editSectionSchema } from "../schemas/editSectionSchema";

export default function useUpdateSection() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.SectionPage"); // Update translation key

  return useMutation({
    mutationFn: ({
      id,
      sectionData,
    }: {
      id: number | string;
      sectionData: Partial<editSectionSchema>; // Changed to FormData for file uploads
    }) => {
      const formData = jsonToFormData(sectionData);
      formData.append("_method", "PUT");
      return updateSection(id, formData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SECTIONS_TABLE_QUERY_KEY] });
      toast.success(t("updated")); // Added success variant
    },
    onError: (error) => {
      toast.error(error.message); // Added error variant
    },
  });
}
