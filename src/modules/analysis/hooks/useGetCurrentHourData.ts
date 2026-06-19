import { useTableQuery } from "@/hooks/useTableQuery";
import { fetchCurrentHourClient } from "../services/analysis";

export const useGetCurrentHourData = () => {
    return useTableQuery({
        queryKey: ["current_hour_analysis"],
        fetchFn: () => fetchCurrentHourClient(),
    });
};
