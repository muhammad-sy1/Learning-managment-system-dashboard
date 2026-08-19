export type PayoutStatus = "pending" | "approved" | "rejected";

export interface IPayoutInstructor {
    id: number;
    name: string;
    email: string;
}

export interface IPayoutRequest {
    id: number;
    instructor?: IPayoutInstructor;
    amount: number | string;
    status: PayoutStatus;
    rejection_reason?: string | null;
    processed_at?: string | null;
    created_at: string;
}

export interface IPayoutListResponse {
    data: IPayoutRequest[];
    meta?: {
        current_page: number;
        last_page: number;
        total: number;
    };
}

export interface IProcessPayoutPayload {
    payout_id: number;
    status: Exclude<PayoutStatus, "pending">;
    rejection_reason?: string;
}

export interface IInstructorEarningsResponse {
    data: {
        summary: {
            total_pending: number;
            total_paid: number;
            total_earned: number;
        };
        earnings: Array<{
            id: number;
            course: string;
            gross_amount: number | string;
            platform_fee: number | string;
            instructor_net: number | string;
            status: string;
            date: string;
        }>;
    };
}
