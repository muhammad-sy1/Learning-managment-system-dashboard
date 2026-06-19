import Cookies from "js-cookie";
import { useQuery } from "@tanstack/react-query";
import { useQueryParams } from "@/hooks/useQueryParams";
import { TRANSACTIONS_TABLE_QUERY_KEY } from "../..";
import { fetchTransactionsClient } from "../../services/transaction";
import { TransactionFilters } from "../../types/transaction";

export const useGetTransactions = (extraFilters?: Partial<TransactionFilters>) => {
  const filters = useQueryParams();
  const mergedFilters = {
    ...filters,
    ...extraFilters,
  };

  return useQuery({
    queryKey: [TRANSACTIONS_TABLE_QUERY_KEY, mergedFilters],
    queryFn: () => fetchTransactionsClient(mergedFilters),
    enabled: !!Cookies.get("token"),
  });
};
