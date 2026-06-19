import { useTableQuery } from "@/hooks/useTableQuery";
import { Info_QUERY_KEY } from "..";
import { fetchInfoClient } from "../services/info";

export const useGetInfo = () => {
  return useTableQuery({
    queryKey: [Info_QUERY_KEY],
    fetchFn: fetchInfoClient,
  });
};
