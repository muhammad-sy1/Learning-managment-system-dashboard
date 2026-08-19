import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { usePermissionStore } from "@/hooks/usePermissionStore";
import { useTableQuery } from "@/hooks/useTableQuery";
import {
    fetchAdminPayoutRequests,
    fetchInstructorEarnings,
    fetchInstructorPayoutRequests,
    processAdminPayout,
    requestInstructorPayout,
} from "../services/payouts";
import { IProcessPayoutPayload } from "../types/payout";
import useAuth from "@/modules/auth/store/authStore";

export const PAYOUTS_QUERY_KEY = "payout-requests";

export function useGetPayoutRequests() {
    const user = useAuth((state) => state.user);
    const isInstructor = user?.role === "student";

    return useTableQuery({
        queryKey: [PAYOUTS_QUERY_KEY, isInstructor ? "student" : "admin"],
        fetchFn: (filters) =>
            isInstructor
                ? fetchInstructorPayoutRequests(filters)
                : fetchAdminPayoutRequests(filters),
    });
}

export function useGetInstructorEarnings(enabled: boolean) {
    return useQuery({
        queryKey: [PAYOUTS_QUERY_KEY, "earnings"],
        queryFn: fetchInstructorEarnings,
        enabled,
    });
}

export function useRequestInstructorPayout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: requestInstructorPayout,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PAYOUTS_QUERY_KEY] });
        },
    });
}

export function useProcessAdminPayout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: IProcessPayoutPayload) => processAdminPayout(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [PAYOUTS_QUERY_KEY] });
        },
    });
}
