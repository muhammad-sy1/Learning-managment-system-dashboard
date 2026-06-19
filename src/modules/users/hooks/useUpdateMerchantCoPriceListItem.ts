import { queryClient } from "@/lib/react-query/queryClient";
import { ApiError } from "@/utils/handleApiError";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateMerchantCoPriceListItem } from "../services/users";
import { IMerchantCoPriceListItemPayload } from "../types/users";
import { MERCHANT_CO_PRICE_LIST_QUERY_KEY } from "./useGetMerchantCoPriceList";

export function useUpdateMerchantCoPriceListItem(
  merchantId: number | string,
) {
  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: number | string;
      data: IMerchantCoPriceListItemPayload;
    }) => updateMerchantCoPriceListItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [MERCHANT_CO_PRICE_LIST_QUERY_KEY, String(merchantId)],
      });
    },
    onError: (error: ApiError) => {
      toast.error(error.message);
    },
  });
}
