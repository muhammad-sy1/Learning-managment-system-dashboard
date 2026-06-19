import { useQuery } from "@tanstack/react-query";
import { getMerchantWorkingHours } from "../services/users";

export const WORKING_HOURS_QUERY_KEY = "working-hours";

export const useGetWorkingHours = (
    merchantId: number | string,
    enabled = true,
) => {
    return useQuery({
        queryKey: [WORKING_HOURS_QUERY_KEY, String(merchantId)],
        queryFn: () => getMerchantWorkingHours(merchantId),
        enabled: enabled && !!merchantId,
    });
};
