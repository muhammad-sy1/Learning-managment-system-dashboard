import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CATEGORIES_TABLE_QUERY_KEY } from "..";
import { deleteCategory } from "../services/categories";

export default function useDeleteCategory() {
    const queryClient = useQueryClient();
    const t = useTranslations("Dashboard.CategoriesPage");

    return useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CATEGORIES_TABLE_QUERY_KEY] });
            toast.success(t("deleted"));
        },
        onError: (error: any) => {
            toast.error(error.message || t("deleteError"));
        },
    });
}
