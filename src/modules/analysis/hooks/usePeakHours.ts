import { useTableQuery } from "@/hooks/useTableQuery";
import { fetchPeakHoursData } from "../services/analysis";

export const useGetPeakHoursData = () => {
  return useTableQuery({
    queryKey: ["peak_hours_analysis"],
    fetchFn: () => fetchPeakHoursData(),
  });
};
