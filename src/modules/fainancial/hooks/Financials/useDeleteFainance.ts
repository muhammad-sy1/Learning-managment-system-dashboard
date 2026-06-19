import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { FAINANCIAL_TABLE_QUERY_KEY } from "../.."; // Update constant
import { deleteSection } from "../../services/financial";

export default function useDeleteFainance() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.SectionPage"); // Update translation key

  return useMutation({
    mutationFn: deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [FAINANCIAL_TABLE_QUERY_KEY] });
      toast.success(t("deleted")); // Added success variant
    },
    onError: (error) => {
      toast.error(error.message); // Added error variant
    },
  });
}
