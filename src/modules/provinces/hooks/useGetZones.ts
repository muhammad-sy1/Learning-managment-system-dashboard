import { useTableQuery } from "@/hooks/useTableQuery";
import { ZONES_TABLE_QUERY_KEY } from "..";
import { fetchZonesClient } from "../services/zones";

export const useGetZones = () => {
  return useTableQuery({
    queryKey: [ZONES_TABLE_QUERY_KEY],
    fetchFn: fetchZonesClient,
  });
};
