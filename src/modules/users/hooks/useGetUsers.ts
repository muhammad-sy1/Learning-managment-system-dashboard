import { useTableQuery } from "@/hooks/useTableQuery";
import Cookies from "js-cookie";
import { USERS_TABLE_QUERY_KEY } from "..";
import { fetchUsersClient } from "../services/users";

export const useGetUsers = (roleFromProps?: string, isInstructor?: boolean) => {
  const normalizedRole = roleFromProps
    ? roleFromProps.toUpperCase() === "STUDENT"
      ? "STUDENT"
      : roleFromProps.toUpperCase()
    : undefined;

  return useTableQuery({
    // include roleFromProps and isInstructor in queryKey so multiple tables on same page don't collide
    queryKey: [
      USERS_TABLE_QUERY_KEY,
      normalizedRole ?? undefined,
      isInstructor ? "is_instructor" : undefined,
    ],
    // Wrap fetchFn so we can inject role or is_instructor filters from props
    fetchFn: (filters: Record<string, unknown>) =>
      fetchUsersClient(
        { ...filters, ...(isInstructor ? { is_instructor: 1 } : {}) },
        normalizedRole,
      ),
    options: {
      enabled: !!Cookies.get("token"),
    },
  });
};
