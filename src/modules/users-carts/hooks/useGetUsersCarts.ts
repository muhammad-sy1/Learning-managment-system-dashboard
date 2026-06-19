import { useTableQuery } from "@/hooks/useTableQuery";
import { USERS_CARTS_QUERY_KEY } from "..";
import { fetchUsersCartsClient } from "../services/usersCarts";

export const useGetUsersCarts = () => {
  return useTableQuery({
    queryKey: [USERS_CARTS_QUERY_KEY],
    fetchFn: fetchUsersCartsClient,
  });
};
