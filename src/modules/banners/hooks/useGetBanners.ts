import { useTableQuery } from "@/hooks/useTableQuery";
import { BANNERS_TABLE_QUERY_KEY } from "..";
import { fetchBannersClient } from "../services/banners";

export const useGetBanners = () => {
  return useTableQuery({
    queryKey: [BANNERS_TABLE_QUERY_KEY],
    fetchFn: fetchBannersClient,
  });
};
