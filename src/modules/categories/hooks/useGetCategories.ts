import { useTableQuery } from "@/hooks/useTableQuery";
import { CATEGORIES_TABLE_QUERY_KEY } from "..";
import { fetchCategoriesClient } from "../services/categories";

export const useGetCategories = () => {
    return useTableQuery({
        queryKey: [CATEGORIES_TABLE_QUERY_KEY],
        fetchFn: () => fetchCategoriesClient(),
    });
};
