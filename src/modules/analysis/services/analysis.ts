import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { handleApiError } from "@/utils/handleApiError";
import { OnlineAnalysisSchema } from "../schemas/onlineAnalysisSchema";
import { IGetCurrentHourResponse, IGetHeatmapResponse, IGetHourlyUsageResponse, IGetOnlineAnalysisResponse, IGetPeakHoursResponse, IGetRangeAnalysisResponse } from "../types/analysis";

export async function fetchOnlineAnalysisClient(filters?: OnlineAnalysisSchema) {
  try {
    const response = await fetcherClient.get<IGetOnlineAnalysisResponse>(
      endpoints.getOnlineAnalysis,
      { params: { ...filters } },
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}


export async function fetchCurrentHourClient() {
  try {
    const response = await fetcherClient.get<IGetCurrentHourResponse>(
      endpoints.getCurrentHour,
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function fetchRangeAnalysisClient(filters?: Record<string, any>) {
  try {
    const response = await fetcherClient.get<IGetRangeAnalysisResponse>(
      endpoints.getAnalyticsRange,
      { params: { ...filters } },
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}
export async function fetchHourlyUsageData(filters?: Record<string, any>) {
  try {
    const response = await fetcherClient.get<IGetHourlyUsageResponse>(
      endpoints.getHourlyUsageData,
      { params: { ...filters } },
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function fetchHeatmapData() {
  try {
    const response = await fetcherClient.get<IGetHeatmapResponse>(
      endpoints.getHeatmapData,
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function fetchPeakHoursData() {
  try {
    const response = await fetcherClient.get<IGetPeakHoursResponse>(
      endpoints.getPeakHours,
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}
