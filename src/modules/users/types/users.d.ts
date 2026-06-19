import { IZone } from "@/modules/provinces/types/zone";

interface IAccountType {
  id: number;
  name: string;
}

export interface IWorkingHour {
  id?: number;
  day_name: string;
  opens_at: string;
  closes_at: string;
}

export type IGroupedWorkingHours = Record<
  string,
  Array<{
    id?: number;
    opens_at: string;
    closes_at: string;
  }>
>;

export interface IGetWorkingHoursResponse {
  data?: IWorkingHour[] | { working_hours?: IWorkingHour[] | IGroupedWorkingHours };
  working_hours?: IWorkingHour[] | IGroupedWorkingHours;
}

export type MerchantCoPriceListFilter = "items" | "images";

export interface IMerchantCoPriceListItem {
  id?: number;
  name: string;
  description: string;
  main_price: number | string | null;
  new_price: number | string | null;
  is_hidden: boolean;
}

export interface IMerchantCoPriceListImage {
  id?: number;
  image: string;
}

export interface IMerchantCoPriceListData {
  items: IMerchantCoPriceListItem[];
  images: IMerchantCoPriceListImage[];
}

export interface IMerchantCoPriceListPaginatedResponse<T> {
  current_page?: number;
  data?: T[];
  last_page?: number;
  total?: number;
}

export interface IGetMerchantCoPriceListResponse {
  data?:
    | IMerchantCoPriceListData
    | IMerchantCoPriceListItem[]
    | IMerchantCoPriceListImage[];
  items?:
    | IMerchantCoPriceListItem[]
    | IMerchantCoPriceListPaginatedResponse<IMerchantCoPriceListItem>;
  images?:
    | IMerchantCoPriceListImage[]
    | IMerchantCoPriceListPaginatedResponse<IMerchantCoPriceListImage>;
}

export interface IMerchantCoPriceListItemPayload {
  name: string;
  description: string;
  main_price: number;
  new_price: number;
  is_hidden: boolean;
}

export interface IUser {
  account_type: IAccountType;
  store_name: string;
  total_app_commission: string;
  store_location: string;
  store_latitude: string;
  store_longitude: string;
  id: number;
  is_open: number;
  supports_custom_order: number;
  supports_normal_order: number;
  app_commession: number | null;
  store_name_slug: string;
  total_earnings: number | null;
  store_type: string;
  store_category: string;

  total_sales: number | string | null;
  order_discounts_total: number | string | null;
  total_other_transactions: number | string | null;
  total_final_amount: number | string | null;

  shipping_discounts_total: number | string | null;
  orders_total_income: number | string | null;

  // app_commession: number | null;
  blocked_at: string | null;
  roles: string[];
  usd_to_syp_rate: number | null;
  created_at: string;
  email: string;
  bio?: string;
  // full_name: string;
  first_name: string;
  last_name: string;
  image: string | null;
  cover_image: string | null;
  images: string[];
  permissions: string[];
  country_code: string;
  phone_number: string;
  is_delivery_manager: 0 | 1;
  delivery_manager: {
    id: number;
    first_name: string;
    last_name: string;
  };


  is_delivery_office_worker: 0 | 1;
  is_delivery_admin: 0 | 1;
  zones: IZone[];
}

export interface IGetUserResponse {
  data: {
    users: IPaginatedResponse<IUser>;
  };
}

export interface IGetUserTokenResponse {
  data: {
    token: string;
  };
}

export interface UserFilters {
  page?: number; // Current pagination page
  limit?: number; // Items per page
  role?: "CLIENT" | "MERCHANT" | "ADMIN" | "DELIVERY"; // User's role (e.g., "USER")
  full_name?: string; // Full name search query
  email?: string; // Email search query
  country_id?: number; // Country identifier
  account_type_id?: number; // Account type identifier
  specialty_id?: number; // Primary specialty ID
  sub_specialty_ids?: number[]; // List of sub-specialty IDs
}
