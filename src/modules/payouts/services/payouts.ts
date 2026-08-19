import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { handleApiError } from "@/utils/handleApiError";
import {
    IInstructorEarningsResponse,
    IPayoutListResponse,
    IProcessPayoutPayload,
} from "../types/payout";

export async function fetchInstructorPayoutRequests(filters: Record<string, unknown>) {
    try {
        return await fetcherClient.get<IPayoutListResponse>(
            endpoints.getInstructorPayoutRequests,
            { params: filters },
        );
    } catch (error) {
        throw handleApiError(error);
    }
}

export async function fetchAdminPayoutRequests(filters: Record<string, unknown>) {
    try {
        return await fetcherClient.get<IPayoutListResponse>(
            endpoints.getAdminPayoutRequests,
            { params: filters },
        );
    } catch (error) {
        throw handleApiError(error);
    }
}

export async function fetchInstructorEarnings() {
    try {
        return await fetcherClient.get<IInstructorEarningsResponse>(
            endpoints.getInstructorEarnings,
        );
    } catch (error) {
        throw handleApiError(error);
    }
}

export async function requestInstructorPayout() {
    try {
        return await fetcherClient.post(endpoints.requestInstructorPayout);
    } catch (error) {
        throw handleApiError(error);
    }
}

export async function processAdminPayout(payload: IProcessPayoutPayload) {
    try {
        return await fetcherClient.post(endpoints.processAdminPayout, payload);
    } catch (error) {
        throw handleApiError(error);
    }
}
