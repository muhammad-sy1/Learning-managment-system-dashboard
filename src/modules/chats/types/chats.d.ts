// types/conversation.ts

export interface IUser {
  id: number;
  first_name: string;
  last_name: string;
  image?: string;
  email?:string;
}

export interface IAdmin {
  id: number;
  first_name: string;
  last_name: string;
}

export type SenderType = "user" | "admin";

export interface IMessage {
  id: number;
  sender_type: SenderType;
  body: string;
  sender: IUser | IAdmin;
  created_at: string;
}

export type ConversationStatus = "OPEN" | "CLOSED" | "RATED";

export interface IConversation {
  id: number;
  status: ConversationStatus;
  closed_at: string | null;
  last_message: IMessage;
  last_reply_admin: IAdmin | null;
  user: IUser;
}

export interface IConversationWithMessages {
  messages: IMessage[];
  conversation:{
    user: IUser;
    status:string
  }
}
export interface IGetConversationResponse {
  data: IConversationWithMessages;
}

export interface IGetConversationsResponse {
  data: {
    conversations: {
      current_page: number;
      data: IConversation[];
      last_page: number;
      total: number;
    };
  };
}

export interface IGetMessagesResponse {
  data: {
    messages: IMessage[];
  };
}
export interface IReview {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  conversation: {
    id: number;
    status: ConversationStatus;
    closed_at: string | null;
    user: IUser; 
  };
}
export interface IGetRatingsResponse {
  data: {
    ratings: {
      current_page: number;
      data: IReview[];
      last_page: number;
      total: number;
    };
  };
}

export interface IReplyConversationRequest {
  body: string;
}

// export interface IReplyConversationResponse extends IMessage {}

export interface ChatsFiltersSchema {
  status?: string;
  page: number;
  search?: string;

}
