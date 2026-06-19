import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { PAGINATION_LIMIT } from "@/lib/constants";
import { handleApiError } from "@/utils/handleApiError";
import { chatsFiltersSchema } from "../schemas/chatsFiltersSchema";
import {
  IGetConversationResponse,
  IGetConversationsResponse,
  IGetRatingsResponse,
} from "../types/chats";

export async function fetchChatsClient(filters?: chatsFiltersSchema) {
  try {
    const response = await fetcherClient.get<IGetConversationsResponse>(
      endpoints.getChats,
      {
        params: {
          ...filters,
          paginate: 1,
          limit: PAGINATION_LIMIT,
        },
      }
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function fetchConversationClient(
  conversation: number,
  isInitialLoad?: boolean,
  lastMessageId?: number,
  filters?: chatsFiltersSchema
) {
  try {
    const response = await fetcherClient.get<IGetConversationResponse>(
      `${endpoints.getconversation}${conversation}/messages`,
      {
        params: {
          ...filters,
          paginate: 1,
          limit: PAGINATION_LIMIT,
          conversation: conversation,
          initial: isInitialLoad,
          after_id: lastMessageId,
        },
      }
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}
export async function fetchRatingChatsClient(filters?: chatsFiltersSchema) {
  try {
    const response = await fetcherClient.get<IGetRatingsResponse>(
      endpoints.ratingsConversations,
      {
        params: {
          ...filters,
          paginate: 1,
          limit: PAGINATION_LIMIT,
        },
      }
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function CloseConversation(conversationId: number) {
  try {
    const response = await fetcherClient.post(
      endpoints.closeConversation + conversationId + "/close",
      conversationId
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

// service
export async function SendMessage({
  conversationId,
  message,
}: {
  conversationId: number;
  message: string;
}) {
  try {
    const response = await fetcherClient.post(
      `${endpoints.closeConversation}${conversationId}/messages`,
      {
        body: message, // payload
      }
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}
