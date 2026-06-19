import { useTableQuery } from "@/hooks/useTableQuery";
import { SECTIONS_TABLE_QUERY_KEY } from "..";
import { SectionFiltersSchema } from "../schemas/sectionFiltersSchema";
import { fetchSectionsClient } from "../services/sections";

export const useGetSections = (filters: SectionFiltersSchema) => {
  return useTableQuery({
    queryKey: [SECTIONS_TABLE_QUERY_KEY, filters.type],
    fetchFn: () => fetchSectionsClient(filters),
  });
};
