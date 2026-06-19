import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { PAGINATION_LIMIT } from "@/lib/constants";
import { handleApiError } from "@/utils/handleApiError";
import { IGetRatingsProductResponse } from "../types/ratingsProduct";

export async function fetchRatingsProductClient(productId: string | null, id: string | null) {
  try {
    const response = await fetcherClient.get<IGetRatingsProductResponse>(
      endpoints.getProducts + `/${productId}` + "/ratings",
      {
        params: {
          //   ...filters,
          id:id,
          paginate: 1,
          limit: PAGINATION_LIMIT,
        },
      }
    );
    return response.data.ratings;
  } catch (err) {
    throw handleApiError(err);
  }
}


export async function deleteRateProduct(id: number | string) {
  try {
    const response = await fetcherClient.delete(
      `${endpoints.deleteRateProduct}${id}`
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}