// api/banners.ts
import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { PAGINATION_LIMIT } from "@/lib/constants";
import { handleApiError } from "@/utils/handleApiError";
import { BannersFiltersSchema } from "../schemas/bannersFiltersSchema";
import { IGetBannerResponse } from "../types/banner";

export async function fetchBannersClient(filters?: BannersFiltersSchema) {
  try {
    const response = await fetcherClient.get<IGetBannerResponse>(
      endpoints.getBanners,
      {
        params: {
          ...filters,
          paginate: 1,
          limit: PAGINATION_LIMIT,
        },
      }
    );
    return response.data.banners;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function createBanner(bannerData: FormData) {
  try {
    const response = await fetcherClient.post(
      endpoints.createBanner,
      bannerData
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function updateBanner(id: number | string, bannerData: FormData) {
  try {
    const response = await fetcherClient.post(
      `${endpoints.updateBanner}${id}`,
      bannerData
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

// حذف بانر
export async function deleteBanner(id: number | string) {
  try {
    const response = await fetcherClient.delete(
      `${endpoints.deleteBanner}${id}`
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}
