import fetcherClient from "@/lib/api/fetcher/client";
import { IGetLogsResponse } from "../types/productLogs";
import endpoints from "@/lib/api/endPoints";
import { PAGINATION_LIMIT } from "@/lib/constants";
import { handleApiError } from "@/utils/handleApiError";

export async function fetchLogsProductClient(productId: string | null) {
  try {
    const response = await fetcherClient.get<IGetLogsResponse>(
      endpoints.getProducts + `/${productId}` + "/logs",
      {
        params: {
          //   ...filters,
          paginate: 1,
          limit: PAGINATION_LIMIT,
        },
      }
    );
    return response.data.logs;
  } catch (err) {
    throw handleApiError(err);
  }
}

