import { queryClient } from "@/lib/react-query/queryClient";
import { ApiError } from "@/utils/handleApiError";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadMerchantCoPriceListImage } from "../services/users";
import { MERCHANT_CO_PRICE_LIST_QUERY_KEY } from "./useGetMerchantCoPriceList";

export function useUploadMerchantCoPriceListImage(
  merchantId: number | string,
) {
  return useMutation({
    mutationFn: (files: File[]) =>
      uploadMerchantCoPriceListImage(merchantId, files),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [MERCHANT_CO_PRICE_LIST_QUERY_KEY, String(merchantId)],
      });
      await queryClient.refetchQueries({
        queryKey: [
          MERCHANT_CO_PRICE_LIST_QUERY_KEY,
          String(merchantId),
          "images",
        ],
        exact: true,
      });
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
  });
}
