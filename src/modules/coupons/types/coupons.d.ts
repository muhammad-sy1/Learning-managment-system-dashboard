export interface IGetProvinceResponse {
  data: {
    provinces: {
      current_page: number;
      data: IProvince[];
      last_page: number;
      total: number;
    };
  };
}

// types/coupon.ts
export type CouponType = "PERCENTAGE" | "FIXED";

export interface ICouponUser {
  id: number;
  first_name: string;
  last_name: string;
  pivot: {
    coupon_id: number;
    user_id: number;
    created_at: string;
    updated_at: string;
  };
}

export interface ICouponProduct {
  id: number;
  name: string;
  pivot: {
    coupon_id: number;
    product_id: number;
  };
}

export interface ICouponMerchant {
  id: number;
  first_name: string;
  last_name: string;
  pivot: {
    coupon_id: number;
    merchant_id: number;
  };
}

interface ICoupon {
  id: number;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: string;
  min_order_amount?: number;
  is_company_sponsored: number;
  is_global_for_products: number;
  is_global_for_users: number;
  expires_at: string;
  usage_limit: number;
  applies_to: "PRODUCTS" | "CUSTOM_ORDER_SHIPPING" | "SHIPPING";
  uses_count: number;
  updated_at: string;
  created_at: string;
  users: Array<{ id: number; first_name: string; last_name: string }>;
  products: Array<{ id: number; name: string }>;
  merchants: Array<{ id: number; first_name: string; last_name: string }>;
}

export interface IGetCouponByIdResponse {
  data: {
    coupon: ICoupon;
  };
}
export interface IGetCouponByIdResponse {
  data: {
    coupon: ICoupon;
  };
}
export interface IGetCouponResponse {
  data: {
    coupons: IPaginatedResponse<ICoupon>;
  };
}

export interface CreateCouponPayload {
  code: string;
  usage_limit?: number;
  type: CouponType;
  value: number;
  expires_at: string;
  is_global_for_users: number;
  is_global_for_products: number;
  user_ids?: string[];
  product_ids?: string[];
  merchant_ids?: string[];
}
