import { jsonToFormData } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PRODUCTS_TABLE_QUERY_KEY, PRODUCTS_TABLE_QUERY_KEY_ID } from "..";
import { updateProduct } from "../services/products";

interface ToggleFinalReviewPayload {
    id: number | string;
    is_final_reviewed: 0 | 1;
}

export default function useToggleFinalReviewProduct() {
    const queryClient = useQueryClient();
    const t = useTranslations("Dashboard.ProductPage");

    return useMutation({
        mutationFn: ({ id, is_final_reviewed }: ToggleFinalReviewPayload) => {
            const formData = jsonToFormData({ is_final_reviewed });
            formData.append("_method", "PUT");
            return updateProduct(id, formData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_TABLE_QUERY_KEY] });
            queryClient.invalidateQueries({ queryKey: [PRODUCTS_TABLE_QUERY_KEY_ID] });
            toast.success(t("messages.updateSuccess"));
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}
