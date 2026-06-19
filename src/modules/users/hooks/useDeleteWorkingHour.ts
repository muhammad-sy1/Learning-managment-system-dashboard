import { queryClient } from "@/lib/react-query/queryClient";
import { ApiError } from "@/utils/handleApiError";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteMerchantWorkingHour } from "../services/users";
import { WORKING_HOURS_QUERY_KEY } from "./useGetWorkingHours";

export default function useDeleteWorkingHour(merchantId: number | string) {
    return useMutation({
        mutationFn: (hourId: number | string) =>
            deleteMerchantWorkingHour(hourId),
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
