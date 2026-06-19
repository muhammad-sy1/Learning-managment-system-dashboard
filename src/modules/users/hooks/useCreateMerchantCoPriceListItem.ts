import { queryClient } from "@/lib/react-query/queryClient";
import { ApiError } from "@/utils/handleApiError";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createMerchantCoPriceListItem } from "../services/users";
import { IMerchantCoPriceListItemPayload } from "../types/users";
import { MERCHANT_CO_PRICE_LIST_QUERY_KEY } from "./useGetMerchantCoPriceList";

export function useCreateMerchantCoPriceListItem(
  merchantId: number | string,
) {
  return useMutation({
    mutationFn: (data: IMerchantCoPriceListItemPayload) =>
      createMerchantCoPriceListItem(merchantId, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [MERCHANT_CO_PRICE_LIST_QUERY_KEY, String(merchantId)],
      });
      await queryClient.refetchQueries({
        queryKey: [
          MERCHANT_CO_PRICE_LIST_QUERY_KEY,
          String(merchantId),
          "items",
        ],
        exact: true,
      });
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
  });
}
