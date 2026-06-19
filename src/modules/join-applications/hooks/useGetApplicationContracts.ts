import { useQuery } from "@tanstack/react-query";
import { APPLICATION_CONTRACTS_QUERY_KEY } from "..";
import { fetchApplicationContractsClient } from "../services/applications";

export const useGetApplicationContracts = ({
  id,
  enabled = true,
}: {
  id: number | string;
  enabled?: boolean;
}) => {
  return useQuery({
    queryKey: [APPLICATION_CONTRACTS_QUERY_KEY, String(id)],
    queryFn: () => fetchApplicationContractsClient(id),
    enabled,
  });
};
