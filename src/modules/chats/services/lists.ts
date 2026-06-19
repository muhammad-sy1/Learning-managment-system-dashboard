import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { handleApiError } from "@/utils/handleApiError";

export async function fetchUsersList() {
  try {
    const response = await fetcherClient.get<IApiResponse<IUserListsResponse>>(
      endpoints.usersFiltersList
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

/*

https://munaseb-back.bayanmasters.com/api/v1/admin/users?page=1&paginate=10&role=USER&full_name=TEST&email=TEST&country_id=1&city_id=1&account_type_id=19&specialty_id=20&has_reports=1&sub_specialty_ids[]=21&sub_specialty_ids[]=23&sub_specialty_ids[]=22
*/
