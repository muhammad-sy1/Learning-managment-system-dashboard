import { queryClient } from "@/lib/react-query/queryClient";
import { ApiError } from "@/utils/handleApiError";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteMerchantCoPriceListItem } from "../services/users";
import { MERCHANT_CO_PRICE_LIST_QUERY_KEY } from "./useGetMerchantCoPriceList";

export function useDeleteMerchantCoPriceListItem(
  merchantId: number | string,
) {
  return useMutation({
    mutationFn: (itemId: number | string) => deleteMerchantCoPriceListItem(itemId),
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
