import { queryClient } from "@/lib/react-query/queryClient";
import { ApiError } from "@/utils/handleApiError";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { createMerchantWorkingHour } from "../services/users";
import { WORKING_HOURS_QUERY_KEY } from "./useGetWorkingHours";

export default function useCreateWorkingHour(merchantId: number | string) {
    return useMutation({
        mutationFn: (data: {
            day_name: string;
            opens_at: string;
            closes_at: string;
        }) => createMerchantWorkingHour(merchantId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [WORKING_HOURS_QUERY_KEY, String(merchantId)],
            });
        },
        onError: (error: ApiError) => {
            toast.error(error.message);
        },
    });
}
