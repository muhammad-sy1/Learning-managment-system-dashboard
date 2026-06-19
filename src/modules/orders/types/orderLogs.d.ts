export interface IOrderLogUser {
  id: number;
  name: string;
  role: string;
}
export interface IOrderLog {
  id: number;
  action: string;
  user: IOrderLogUser;
  changes: Record<string, any> | any[];
  created_at: string;
  action_key: string;
}

export interface IGetOrderLogsResponse {
  data: {
    logs: {
      logs: IPaginatedResponse<IOrderLog>;
    };
  };
}

interface OrdersLogsFilters {
  page?: number; // Current pagination page
  limit?: number; // Items per page
  order_id?: string | number; // Order ID to fetch logs for
}
