import { jsonToFormData } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PRODUCTS_TABLE_QUERY_KEY } from "..";
import { AddProductFormValues } from "../schemas/AddProductSchema";
import { createProduct } from "../services/products";
import { prepareImagesForApi } from "../utils/prepareImagesForApi";

export default function useCreateProduct() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.ProductPage");

  return useMutation({
    mutationFn: (values: AddProductFormValues) => {
      const { images, sizes,options, ...rest } = values;

      const formData = jsonToFormData(rest);

      if (images?.length) {
        const imagesFormData = prepareImagesForApi(images);

        imagesFormData.forEach((value, key) => {
          formData.append(key, value);
        });
      }

      if (Array.isArray(sizes) && sizes.length > 0) {
        formData.set("sizes", sizes.join(";"));
      }
      if (Array.isArray(options) && options.length > 0) {
        formData.set("options", options.join(";"));
      }

      return createProduct(formData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_TABLE_QUERY_KEY] });
      toast.success(t("messages.createSuccess"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
