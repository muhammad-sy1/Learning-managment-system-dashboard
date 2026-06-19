import { useTableQuery } from "@/hooks/useTableQuery";
import { fetchRangeAnalysisClient } from "../services/analysis";

export const useGetRangeData = () => {
    return useTableQuery({
        queryKey: ["range_analysis"],
        fetchFn: (filters) => fetchRangeAnalysisClient(filters),
    });
};
