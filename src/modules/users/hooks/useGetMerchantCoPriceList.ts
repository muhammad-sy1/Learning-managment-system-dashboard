import { useQuery } from "@tanstack/react-query";
import { getMerchantCoPriceList } from "../services/users";
import { MerchantCoPriceListFilter } from "../types/users";

export const MERCHANT_CO_PRICE_LIST_QUERY_KEY = "merchant-co-price-list";

export function useGetMerchantCoPriceList(
  merchantId: number | string,
  filter: MerchantCoPriceListFilter,
  enabled = true,
) {
  return useQuery({
    queryKey: [MERCHANT_CO_PRICE_LIST_QUERY_KEY, String(merchantId), filter],
    queryFn: () => getMerchantCoPriceList(merchantId, filter),
    enabled: enabled && !!merchantId,
    refetchOnMount: "always",
  });
}
