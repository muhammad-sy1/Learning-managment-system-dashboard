export interface IProduct {
  id: number;
  section_id: number;
  description: string;
  name: string;
  main_price: string | number;
  new_price: string | number;
  main_price_usd: string | number;
  new_price_usd: string | number;
  available_from: string;
  available_to: string;
  avg_preparation_minutes: number;
  last_reviewed_by: {
    first_name: string;
    last_name?: string;
    id: number;
  };

  discount_start_date: string | null;
  discount_end_date: string | null;
  is_out_of_stock: 0 | 1;
  is_final_reviewed?: 0 | 1;
  has_offer?: number | boolean;
  has_discount?: boolean;
  weight: string;
  video_url: string;
  sizes: string;
  options: string;
  status: string;
  reject_reason: string | null;
  is_hidden: number;
  review_note?: string | null;
  created_at: string;
  updated_at: string;
  visits_count?: number;
  type: string;
  section: {
    id: number;
    name: string;
    parent: {
      id: number;
      name: string;
    };
  };
  zones: Array<{
    id: number;
    name: string;
  }>;
  images: Array<{
    id: number;
    color: string | null;
    image: string;
    is_blur: 0 | 1;
  }>;
  merchant: IMerchant;
  as_new_price_label: string;
  new_price_label: string;
  as_main_price_label: string;
  main_price_label: string;
  is_price_linked_to_usd: 0 | 1;
  is_refundable: 0 | 1;
}
export interface IMerchant {
  id: number;
  first_name: string;
  last_name?: string;
}
export interface IGetProductsResponse {
  data: {
    products: {
      current_page: number;
      data: IProduct[];
      last_page: number;
      total: number;
    };
  };
}

export interface ImageWithColor {
  id?: number;
  file?: File;
  url: string;
  color?: string;
  is_blur?: 0 | 1;
  isPreview?: boolean;
  markedForDelete?: boolean;
  serverId: number;
}

export type ProductStatus = "APPROVED" | "REJECTED" | "PENDING";
export interface IUpdateProductStatusPayload {
  status: ProductStatus;
  reject_reason?: string;
}
