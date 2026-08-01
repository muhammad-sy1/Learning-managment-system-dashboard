import { useTableQuery } from "@/hooks/useTableQuery";
import Cookies from "js-cookie";
import { USERS_TABLE_QUERY_KEY } from "..";
import { fetchUsersClient } from "../services/users";

export const useGetUsers = (roleFromProps?: string, isInstructor?: boolean) => {
  return useTableQuery({
    queryKey: [
      USERS_TABLE_QUERY_KEY,
      roleFromProps ?? undefined,
      isInstructor ? "is_instructor" : undefined,
    ],
    fetchFn: (filters: Record<string, unknown>) =>
      fetchUsersClient(
        { ...filters, ...(isInstructor ? { is_instructor: 1 } : {}) },
        roleFromProps ?? undefined,
      ),
    options: {
      enabled: !!Cookies.get("token"),
    },
  });
};
