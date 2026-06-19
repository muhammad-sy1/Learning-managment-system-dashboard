// api/coupons.ts
import endpoints from "@/lib/api/endPoints";
import fetcherClient from "@/lib/api/fetcher/client";
import { PAGINATION_LIMIT } from "@/lib/constants";
import { handleApiError } from "@/utils/handleApiError";
import { CouponsFiltersSchema } from "../schemas/CouponsFiltersSchema";
import { EditCouponSchema } from "../schemas/editCouponSchema";
import {
  CreateCouponPayload,
  IGetCouponByIdResponse,
  IGetCouponResponse,
} from "../types/coupons";

export async function fetchCouponsClient(filters?: CouponsFiltersSchema) {
  try {
    const response = await fetcherClient.get<IGetCouponResponse>(
      endpoints.getCoupons,
      {
        params: {
          ...filters,
          paginate: 1,
          limit: PAGINATION_LIMIT,
        },
      }
    );
    return response.data.coupons;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function fetchCouponById(CouponId: number) {
  try {
    const response = await fetcherClient.get<IGetCouponByIdResponse>(
      endpoints.getCoupons + `/${CouponId}`,
      {}
    );
    return response.data.coupon;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function createCoupon(couponData: CreateCouponPayload) {
  try {
    const response = await fetcherClient.post(
      endpoints.createCoupon,
      couponData
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function updateCoupon(
  id: number | string,
  couponData: Partial<EditCouponSchema>
) {
  try {
    const response = await fetcherClient.put(
      `${endpoints.updateCoupon}${id}`,
      couponData
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}

export async function deleteCoupon(id: number | string) {
  try {
    const response = await fetcherClient.delete(
      `${endpoints.deleteCoupon}${id}`
    );
    return response;
  } catch (err) {
    throw handleApiError(err);
  }
}
