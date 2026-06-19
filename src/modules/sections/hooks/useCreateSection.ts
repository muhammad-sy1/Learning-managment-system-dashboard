import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { SECTIONS_TABLE_QUERY_KEY } from ".."; // Update constant
import { createSection } from "../services/sections";
import { jsonToFormData } from "@/lib/utils";
import { addSectionSchema } from "../schemas/addSectionSchema";

export default function useCreateSection() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.SectionPage"); // Update translation key

  return useMutation({
     mutationFn: (data: addSectionSchema) => {
          const formData = jsonToFormData(data);
          return createSection(formData);
        },
   
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SECTIONS_TABLE_QUERY_KEY] });
      toast.success(t("created")); // Added success variant
    },
    onError: (error) => {
      toast.error(error.message); // Added error variant
    },
  });
}
