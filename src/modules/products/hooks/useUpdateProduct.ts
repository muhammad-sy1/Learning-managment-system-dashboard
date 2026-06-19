// hooks/useUpdateProduct.ts
import { jsonToFormData } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { PRODUCTS_TABLE_QUERY_KEY } from "..";
import { EditProductSchema } from "../schemas/editProductSchema";
import { updateProduct } from "../services/products";
import { prepareImagesForApi } from "../utils/prepareImagesForApi";

// hooks/useUpdateProduct.ts
export default function useUpdateProduct() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.ProductPage");

   return useMutation({

    mutationFn: ({ id, productData }: {
      id: number | string;
      productData: Partial<EditProductSchema>;
    }) => {
      const { images, sizes, options, ...rest } = productData;

      const formData = jsonToFormData(rest);

      if (images?.length) {
        const imagesFormData = prepareImagesForApi(images);

        imagesFormData.forEach((value, key) => {
          formData.append(key, value);
        });
      }

      if (Array.isArray(sizes)) {
        formData.append("sizes", sizes.join(";"));
      }

      if (Array.isArray(options)) {
        formData.append("options", options.join(";"));
      } else if (typeof options === "string") {
        formData.append("options", options);
      }

      formData.append("_method", "PUT");

      return updateProduct(id, formData);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PRODUCTS_TABLE_QUERY_KEY] });
      toast.success(t("messages.updateSuccess"));
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
