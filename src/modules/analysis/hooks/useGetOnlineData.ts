import { useTableQuery } from "@/hooks/useTableQuery";
import { fetchOnlineAnalysisClient } from "../services/analysis";
import { OnlineAnalysisSchema } from "../schemas/onlineAnalysisSchema";

export const useGetOnlineData = () => {
    return useTableQuery({
        queryKey: ["online_analysis"],
        fetchFn: (filters) => fetchOnlineAnalysisClient(filters as OnlineAnalysisSchema),
    });
};
