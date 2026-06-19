// hooks/useGetProducts.ts
import { useTableQuery } from "@/hooks/useTableQuery";
import { PRODUCTS_TABLE_QUERY_KEY } from "..";
import { fetchProductsClient } from "../services/products";

export const useGetProducts = () => {
  return useTableQuery({
    queryKey: [PRODUCTS_TABLE_QUERY_KEY],
    fetchFn: fetchProductsClient,
  });
};
