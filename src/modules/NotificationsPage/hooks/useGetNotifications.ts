import { useTableQuery } from "@/hooks/useTableQuery";
import { Notification_TABLE_QUERY_KEY } from "..";
import { fetchNotificationsClient } from "../services/notifications";

export const useGetNotifications = () => {
  return useTableQuery({
    queryKey: [Notification_TABLE_QUERY_KEY],
    fetchFn: fetchNotificationsClient,
  });
};
