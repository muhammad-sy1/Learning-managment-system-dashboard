import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { handleApiError } from "@/utils/handleApiError";
import { IInfoResponse } from "../types/info";

export async function fetchInfoClient() {
  try {
    const response = await fetcherClient.get<IInfoResponse>(endpoints.getInfo, {
      params: {
        // ...filters,
        // paginate: 1,
        app: "admin",
        // limit: PAGINATION_LIMIT,
      },
    });
    return response.data.info;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function UpdateInfoClient(Info: FormData) {
  // Changed to FormData
  try {
    const response = await fetcherClient.post(endpoints.updateInfo, Info);
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function downloadAndroidApk(name: number | string) {
  try {
    const response = await fetcherClient.get<any>(
      `${name}`,
      {
        responseType: "blob",
      },
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}