import fetcherClient from "@/lib/api/fetcher/client";
import { handleApiError } from "@/utils/handleApiError";
import { PAGINATION_LIMIT } from "@/lib/constants";
import endpoints from "@/lib/api/endPoints";
import { zoneFiltersSchema } from "../schemas/zoneFiltersSchema";
import { ICreateZonePayload, IGetZoneResponse, IUpdateZonePayload } from "../types/zone";

export async function fetchZonesClient(filters?: zoneFiltersSchema) {
  try {
    const response = await fetcherClient.get<IGetZoneResponse>(
      endpoints.getZones,
      {
        params: {
          ...filters,
          paginate: 1,
          page: 1,
          limit: PAGINATION_LIMIT,
        },
      }
    );
    return response.data.zones;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function createZone(zoneData: ICreateZonePayload) {
  try {
    const response = await fetcherClient.post(
      endpoints.createZone,
      zoneData
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function updateZone(
  id: number | string,
  zoneData: IUpdateZonePayload
) {
  try {
    const response = await fetcherClient.put(
      `${endpoints.updateZone}${id}`,
      zoneData
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function deleteZone(id: number | string) {
  try {
    const response = await fetcherClient.delete(
      `${endpoints.deleteZone}${id}`
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}