// types/province.ts
export interface INotification {
  id: number;
  title: string;
  body: string;
  read_at: string | null;
  click_action: string;
  data: {
    product_id?: number;
    conversation_id?: number;
    message_id?: number;
    sender_type?: string;
    state: number;
  };
  created_at: string;
};

export interface IGetNotificationsResponse {
  data: {
    notifications: {
      current_page: number;
      data: INotification[];
      last_page: number;
      total: number;
    };
  };
}


export interface ICreateNotification {
  title: string;
  body: string;
  product_id?: number;
  merchant_id?: number;
  with_filters?: string;
  users_ids?: Array<number | string>;
  global_for_client?: number;
  global_for_merchant?: number;
  global_for_delivery?: number;
}
