import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { PAGINATION_LIMIT } from "@/lib/constants";
import { handleApiError } from "@/utils/handleApiError";
import { IGetFinancialSectionResponse } from "../types/fainancial";
import { FinancialFiltersSchema } from "../schemas/Fainancial/FinancialFiltersSchema";

export async function fetchFinancialsClient(filters: FinancialFiltersSchema) {
  try {
    const response = await fetcherClient.get<IGetFinancialSectionResponse>(
      endpoints.getFainancial,
      {
        params: {
          ...filters,
          paginate: 1,
          limit: PAGINATION_LIMIT,
        },
      }
    );
    return response; // Updated to match API response structure
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function createSection(sectionData: FormData) {
  // Changed to FormData
  try {
    const response = await fetcherClient.post(
      endpoints.createSection,
      sectionData
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function updateSection(
  id: number | string,
  sectionData: FormData
) {
  try {
    const response = await fetcherClient.post(
      // Changed to POST for FormData (or keep PUT if your API supports it)
      `${endpoints.updateSection}${id}`, // Update endpoint
      sectionData
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function deleteSection(id: number | string) {
  try {
    const response = await fetcherClient.delete(
      `${endpoints.deleteSection}${id}` // Update endpoint
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}
