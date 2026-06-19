import { useTableQuery } from "@/hooks/useTableQuery";
import { fetchHourlyUsageData } from "../services/analysis";

export const useGetHourlyUsageData = () => {
    return useTableQuery({
        queryKey: ["hourly_usage_analysis"],
        fetchFn: () => fetchHourlyUsageData(),
    });
};
