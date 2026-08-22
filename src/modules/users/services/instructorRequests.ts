import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { handleApiError } from "@/utils/handleApiError";

export interface IInstructorRequest {
  user_id: number;
  name: string;
  email: string;
  title: string;
  bio: string;
  applied_at: string;
}

export async function fetchPendingInstructorsClient() {
  try {
    return await fetcherClient.get<{ data: IInstructorRequest[] }>(
      endpoints.getPendingInstructors,
    );
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function approveInstructorClient(id: number | string) {
  try {
    return await fetcherClient.post(endpoints.approveInstructor(id));
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function rejectInstructorClient(
  id: number | string,
  reason: string,
) {
  try {
    return await fetcherClient.post(endpoints.rejectInstructor(id), { reason });
  } catch (err) {
    throw handleApiError(err);
  }
}
