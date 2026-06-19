import { useTableQuery } from "@/hooks/useTableQuery";
import { FAINANCIAL_TABLE_QUERY_KEY } from "../..";
import { FinancialSectionFilters } from "../../types/fainancial";
import { fetchFinancialsClient } from "../../services/financial";

export const useGetFainancials = (filters: FinancialSectionFilters) => {
  return useTableQuery({
    queryKey: [FAINANCIAL_TABLE_QUERY_KEY, filters.type],
    fetchFn: () => fetchFinancialsClient(filters),
  });
};
