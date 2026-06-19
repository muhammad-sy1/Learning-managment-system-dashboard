import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { SECTIONS_TABLE_QUERY_KEY } from ".."; // Update constant
import { deleteSection } from "../services/sections";

export default function useDeleteSection() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.SectionPage"); // Update translation key

  return useMutation({
    mutationFn: deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SECTIONS_TABLE_QUERY_KEY] });
      toast.success(t("deleted")); // Added success variant
    },
    onError: (error) => {
      toast.error(error.message); // Added error variant
    },
  });
}
