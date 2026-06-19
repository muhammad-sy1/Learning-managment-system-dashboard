import { useTableQuery } from "@/hooks/useTableQuery";
import { RATINGS_CHATS_QUERY_KEY } from "..";
import { fetchRatingChatsClient } from "../services/chtas";

export const useGetRatings = () => {
  return useTableQuery({
    queryKey: [RATINGS_CHATS_QUERY_KEY],
    fetchFn: fetchRatingChatsClient,
  });
};
