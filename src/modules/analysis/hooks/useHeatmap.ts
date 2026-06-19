import { useTableQuery } from "@/hooks/useTableQuery";
import { fetchHeatmapData } from "../services/analysis";

export const useGetHeatmapData = () => {
  return useTableQuery({
    queryKey: ["heatmap_analysis"],
    fetchFn: () => fetchHeatmapData(),
  });
};
