import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { handleApiError } from "@/utils/handleApiError";
import { IPlacesResponse } from "../types/searchMapT";

export async function SearchMapPlaces(query: string, lat: number, lng: number) {
  try {
    const response = await fetcherClient.get<IPlacesResponse>(
      endpoints.searchMap,
      {
        params: {
          query: query,
          lat: lat,
          lng: lng,
          app: "CLIENT",
        },
      }
    );

    return response.data.places;
  } catch (err) {
    throw handleApiError(err);
  }
}

