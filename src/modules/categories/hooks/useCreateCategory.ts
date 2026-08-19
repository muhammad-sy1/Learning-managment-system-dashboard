import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CATEGORIES_TABLE_QUERY_KEY } from "..";
import { createCategory } from "../services/categories";
import { ICreateCategoryPayload } from "../types/category";

export default function useCreateCategory() {
    const queryClient = useQueryClient();
    const t = useTranslations("Dashboard.CategoriesPage");

    return useMutation({
        mutationFn: (categoryData: ICreateCategoryPayload) =>
            createCategory(categoryData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CATEGORIES_TABLE_QUERY_KEY] });
            toast.success(t("created"));
        },
        onError: (error: any) => {
            toast.error(error.message || t("createError"));
        },
    });
}
