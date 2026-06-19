import { useTableQuery } from "@/hooks/useTableQuery";
import { APPLICATIONS_TABLE_QUERY_KEY } from "..";
import { fetchApplicationsClient } from "../services/applications";

export const useGetApplications = () => {
  return useTableQuery({
    queryKey: [APPLICATIONS_TABLE_QUERY_KEY],
    fetchFn: fetchApplicationsClient,
  });
};
