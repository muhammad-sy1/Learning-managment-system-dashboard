import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { PAGINATION_LIMIT } from "@/lib/constants";
import { handleApiError } from "@/utils/handleApiError";
import { IGetUsersCartsResponse } from "../types/usersCarts";

export async function fetchUsersCartsClient(filters: Record<string, unknown>) {
  try {
    const response = await fetcherClient.get<IGetUsersCartsResponse>(
      endpoints.getUsersCarts,
      {
        params: {
          ...filters,
          app: "CLIENT",
          paginate: 1,
          limit: PAGINATION_LIMIT,
        },
      },
    );

    return response.data.users;
  } catch (err) {
    throw handleApiError(err);
  }
}
