import { useQuery } from "@tanstack/react-query";
import { PRODUCT_RATINGS_TABLE_QUERY_KEY } from "..";
import { fetchRatingsProductClient } from "../services/ratingsProduct";

export const useGetRatingsProducts = (productId: string | null, id: string | null) => {
  return useQuery({
    queryKey: [PRODUCT_RATINGS_TABLE_QUERY_KEY, productId],
    queryFn: () => fetchRatingsProductClient(productId, id),
    enabled: !!productId,
  });
};
