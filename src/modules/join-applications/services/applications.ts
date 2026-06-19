import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { PAGINATION_LIMIT } from "@/lib/constants";
import { handleApiError } from "@/utils/handleApiError";
import { ApplicationsFiltersSchema } from "../schemas/applicationsFiltersSchemaFiltersSchema";
import {
  IApplicationContract,
  IGetApplicationContractsResponse,
  IGetApplicationsResponse,
  TApplicationStatusPayload,
  // TApplicationType,
} from "../types/applications";

export async function fetchApplicationsClient(
  filters?: ApplicationsFiltersSchema,
) {
  try {
    console.log("filters");
    const response = await fetcherClient.get<IGetApplicationsResponse>(
      endpoints.getApplications,
      {
        params: {
          paginate: 1,

          limit: PAGINATION_LIMIT,
          ...filters,
        },
      },
    );

    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function updateApplicationsStatus(
  id: number | string,
  payload: TApplicationStatusPayload,
) {
  try {
    const response = await fetcherClient.patch(
      endpoints.updateApplication + id + "/status",
      payload,
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function generateApplicationContract(
  id: number | string,
  payload: { type: "normal" | "custom" | "restaurant"; "app_commission": number },
) {
  try {
    const response = await fetcherClient.post(
      endpoints.generateApplicationContract + id + "/generate/contract",
      payload,
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function SendMessage(
  id: number | string,
) {
  try {
    const response = await fetcherClient.post(
      endpoints.generateApplicationContract + "contracts/" + id + "/send",
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function fetchApplicationContractsClient(id: number | string) {
  try {
    const response = await fetcherClient.get<IGetApplicationContractsResponse>(
      endpoints.getApplicationContracts + id + "/contracts",
    );

    if (Array.isArray(response.data)) return response.data;
    return response.data.contracts ?? [];
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function cancelApplicationContract(id: number | string) {
  try {
    const response = await fetcherClient.post<IApplicationContract>(
      endpoints.cancelApplicationContract + id + "/cancel",
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}
