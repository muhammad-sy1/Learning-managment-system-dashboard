export type BannerType = "HOME" | "HOME_SLIDER" | "FAVORITE" | "MY_ORDERS";

export interface IBanner {
  id: number;
  file: string;
  show_time: number;
  expires_at: string;
  url: string;
  target: "product" | "url" | null;
  product_id?: number;
  product: {
    id: number;
    name: string;
  };
  type: BannerType;
  created_at: string;
  updated_at: string;
}

export interface IGetBannerResponse {
  data: {
    banners: IPaginatedResponse<IBanner>;
  };
}
