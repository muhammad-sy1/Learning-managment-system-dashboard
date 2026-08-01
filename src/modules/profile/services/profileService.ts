import { handleApiError } from "@/utils/handleApiError";
import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";

export async function getProfile() {
  try {
    const response = await fetcherClient.get<IApiResponse<IProfile>>(
      "user"
    );
    // console.log("response.data"+response.data)
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}
export async function updateProfile(data: FormData) {
  try {
    const response = await fetcherClient.post<IApiResponse<IProfile>>(
      endpoints.updateProfile,
      data
    );
    return response.data;
  } catch (err) {
    throw handleApiError(err);
  }
}
