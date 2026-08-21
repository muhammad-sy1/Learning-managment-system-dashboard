import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { handleApiError } from "@/utils/handleApiError";
import { IInstructorStudentsResponse } from "../types";

export async function fetchInstructorStudentsClient(
  filters?: Record<string, unknown>,
) {
  try {
    return await fetcherClient.get<IInstructorStudentsResponse>(
      endpoints.getInstructorStudents,
      { params: { ...filters } },
    );
  } catch (err) {
    throw handleApiError(err);
  }
}
