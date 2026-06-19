import { useTableQuery } from "@/hooks/useTableQuery";
import Cookies from "js-cookie";
import { USERS_TABLE_QUERY_KEY } from "..";
import { fetchUsersClient } from "../services/users";

export const useGetUsers = () => {
  return useTableQuery({
    queryKey: [USERS_TABLE_QUERY_KEY],
    fetchFn: fetchUsersClient,
    options: {
      enabled: !!Cookies.get("token"),
    },
  });
};
