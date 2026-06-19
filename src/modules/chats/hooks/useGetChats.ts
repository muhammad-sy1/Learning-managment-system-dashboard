import { useTableQuery } from "@/hooks/useTableQuery";
import { CHATS_COVERSATIONS_QUERY_KEY } from "..";
import { fetchChatsClient } from "../services/chtas";

export const useGetChats = () => {
  return useTableQuery({
    queryKey: [CHATS_COVERSATIONS_QUERY_KEY],
    fetchFn: fetchChatsClient,
  });
};
