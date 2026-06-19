import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { deleteProduct } from "../services/products";
import { PRODUCT_RATINGS_TABLE_QUERY_KEY, PRODUCTS_TABLE_QUERY_KEY } from "..";
import { deleteRateProduct } from "../services/ratingsProduct";

export default function useDeleteProduct() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.ProductPage");

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_TABLE_QUERY_KEY] });
      toast(t("messages.deleteSuccess"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}

export  function useDeleteRatingProduct() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.ProductPage");

  return useMutation({
    mutationFn: deleteRateProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PRODUCT_RATINGS_TABLE_QUERY_KEY],
      });
      toast(t("ratings.deleteSuccess"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}
