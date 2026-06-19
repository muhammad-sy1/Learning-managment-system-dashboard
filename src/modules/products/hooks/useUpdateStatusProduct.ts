import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PRODUCTS_TABLE_QUERY_KEY } from "..";
import { EditStatusProductSchema } from "../schemas/editStatusProductSchema";
import { updateProductStatus } from "../services/products";

export default function useUpdateStatusProduct() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.ProductPage");

  return useMutation({
    mutationFn: ({
      id,
      productData,
    }: {
      id: number | string;
      productData: EditStatusProductSchema;
    }) => updateProductStatus(id, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PRODUCTS_TABLE_QUERY_KEY],
      });
      toast(t("messages.updateSuccess"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}
