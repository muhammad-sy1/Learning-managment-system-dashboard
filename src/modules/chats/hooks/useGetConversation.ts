// hooks/useGetConversation.ts
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { CONVERSATION_QUERY_KEY } from "..";
import { fetchConversationClient } from "../services/chtas";

export const useGetConversation = (
  conversation: number,
  isInitialLoad?: boolean,
  lastMessageId?: number,
) => {
  return useQuery({
    queryKey: [CONVERSATION_QUERY_KEY, String(conversation)],
    queryFn: () =>
      fetchConversationClient(conversation, isInitialLoad, lastMessageId),
    enabled: !!Cookies.get("token"),
    staleTime: 0,
    gcTime: 0,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    refetchOnMount: true,
  });
};
