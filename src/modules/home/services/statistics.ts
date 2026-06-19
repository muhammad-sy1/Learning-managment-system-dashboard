import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { handleApiError } from "@/utils/handleApiError";
import { StatisticsFiltersSchema } from "../schemas/StatisticsFiltersSchema";
import { IHomeStatistics } from "../types/home";

export async function getStatistics(filters?: StatisticsFiltersSchema) {
  try {
    const response = await fetcherClient.get<IHomeStatistics>(endpoints.home, {
      params: {
        ...filters,
        // paginate: 1,
        // limit: PAGINATION_LIMIT,
      },
    });
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}
