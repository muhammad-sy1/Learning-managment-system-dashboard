export interface IGetApplicationsResponse {
  data: {
    applications: {
      current_page: number;
      data: IApplications[];
      last_page: number;
      total: number;
    };
  };
}

export interface IApplications {
  id: number;
  request_key: string;
  type: TApplicationType;
  business_type_key: TApplicationBusinessType | null;
  store_name: string | null;
  contact_name: string;
  status: TApplicationStatus;
  reason_key: TApplicationReason | null;
  note: string | null;
  reviewed_by: number | null;
  reviewed_at: string | null; // ISO date
  review_note: string | null;
  created_at: string; // ISO date
  updated_at: string; // ISO date
  user: IUser;
  zone: IZone;
  onUpdated?: () => void;
}

export interface IUser {
  id: number;
  phone_number_e164: string;
  first_name: string;
  last_name: string | null;
}

export interface IZone {
  name: string;
}

// Enums / unions
export type TApplicationType = "delivery" | "partner";

export type TApplicationStatus =
  | "submitted"
  | "approved"
  | "rejected"
  | "under_review";

export type TApplicationReason =
  | "extra_income"
  | "flexible_hours"
  | "stable_income"
  | "new_experience";

export type TApplicationBusinessType =
  | "supermarket"
  | "restaurant"
  | "electronics"
  | "clothing"
  | "pharmacy"
  | "other";

export type TApplicationStatusPayload = {
  status: TApplicationStatus;
  review_note?: string | null;
};

export type TApplicationContractStatus =
  | "canceled"
  | "signed"
  | "waiting_signing";

export interface IApplicationContract {
  id: number;
  slug: string;
  type: "normal" | "custom" | "restaurant" | string;
  pdf_path: string | null;
  generated_at: string | null;
  html: string | null;
  accepted_at: string | null;
  generated_by: number | null;
  status: TApplicationContractStatus;
  message: string
}

export interface IGetApplicationContractsResponse {
  data: {
    contracts?: IApplicationContract[];
  } | IApplicationContract[];
}
