import { useQuery } from "@tanstack/react-query";
import { PRODUCTS_TABLE_QUERY_KEY_ID } from "..";
import { getProductById } from "../services/products";

export const useGetProductById = (productId: string) => {
  return useQuery({
    queryKey: [PRODUCTS_TABLE_QUERY_KEY_ID, productId],
    queryFn: () => getProductById(productId),
    enabled: !!productId, 
  });
};
