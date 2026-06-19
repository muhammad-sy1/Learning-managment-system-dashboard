import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { PAGINATION_LIMIT } from "@/lib/constants";
import { handleApiError } from "@/utils/handleApiError";
import { provinceFiltersSchema } from "../schemas/provinceFiltersSchema";
import {
  ICreateNotification,
  IGetNotificationsResponse,
} from "../types/notifications";

export async function fetchNotificationsClient(
  filters?: provinceFiltersSchema,
) {
  try {
    const response = await fetcherClient.get<IGetNotificationsResponse>(
      endpoints.getnotifications,
      {
        params: {
          ...filters,
          paginate: 1,
          app: "ADMIN",
          limit: PAGINATION_LIMIT,
        },
      },
    );
    return response.data.notifications;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function createNotification(
  NotificationData: ICreateNotification,
) {
  // Changed to FormData
  try {
    const response = await fetcherClient.post(
      endpoints.createNotification,
      NotificationData,
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}
