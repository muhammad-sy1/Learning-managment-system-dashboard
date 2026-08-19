import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CATEGORIES_TABLE_QUERY_KEY } from "..";
import { updateCategory } from "../services/categories";
import { ICreateCategoryPayload } from "../types/category";

export default function useUpdateCategory() {
    const queryClient = useQueryClient();
    const t = useTranslations("Dashboard.CategoriesPage");

    return useMutation({
        mutationFn: ({
            id,
            categoryData,
        }: {
            id: number | string;
            categoryData: ICreateCategoryPayload;
        }) => updateCategory(id, categoryData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [CATEGORIES_TABLE_QUERY_KEY] });
            toast.success(t("updated"));
        },
        onError: (error: any) => {
            toast.error(error.message || t("updateError"));
        },
    });
}
