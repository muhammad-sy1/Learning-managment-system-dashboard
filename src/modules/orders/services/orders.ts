import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { PAGINATION_LIMIT } from "@/lib/constants";
import { handleApiError } from "@/utils/handleApiError";
import { OrdersFiltersSchema } from "../schemas/OrdersFiltersSchema";
import { IGetOrderLogsResponse, OrdersLogsFilters } from "../types/orderLogs";
import {
  IGetOrderByIdResponse,
  IGetOrdersResponse,
  IUpdateOrderStatusPayload,
  OrderType,
} from "../types/orders";

export async function fetchOrdersClient(filters?: OrdersFiltersSchema) {
  try {
    const response = await fetcherClient.get<IGetOrdersResponse>(
      endpoints.getOrders,
      {
        params: {
          ...filters,
          paginate: 1,
          // types: "RESTURANT,MARKET",
          limit: PAGINATION_LIMIT,
        },
      },
    );

    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}

//fetchOrderByIdClient
export async function fetchOrderByIdClient(
  id: number | string,
  orderType?: OrderType,
) {
  try {
    const response = await fetcherClient.get<IGetOrderByIdResponse>(
      orderType === "CUSTOM"
        ? endpoints.getOrederById + "custom/" + id
        : endpoints.getOrederById + id,
    );

    // console.log("qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq" + JSON.stringify(response.data));
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}

//fetchOrdersLogClient
export async function fetchOrdersLogClient(filters: OrdersLogsFilters) {
  try {
    const response = await fetcherClient.get<IGetOrderLogsResponse>(
      endpoints.getLogOrders + filters?.order_id + "/logs",
    );

    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function updateOrderStatus(
  id: number | string,
  payload: IUpdateOrderStatusPayload,
) {
  try {
    const response = await fetcherClient.put(
      endpoints.updateOrder + id,
      payload,
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}
export async function ConfirmReturQuantity(
  id: number | string,
  returned_quantity: number,
) {
  try {
    const response = await fetcherClient.put(
      endpoints.updateOrderStatus + id + `/refund`,
      {
        returned_quantity: returned_quantity,
      },
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}
export async function ConfirmCancelReturn(
  id: number | string,
  cancel_quantity: number,
) {
  try {
    const response = await fetcherClient.put(
      `${endpoints.updateOrderStatus}${id}/unrefund`,
      { unrefunded_quantity: cancel_quantity },
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function assignOrder(
  orderId: number | string,
  body: { delivery_id: number | string }
) {
  try {
    const response = await fetcherClient.post(
      endpoints.assignOrder + orderId + `/assign`,
      body
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}
