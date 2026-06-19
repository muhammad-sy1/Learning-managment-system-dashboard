import { IProduct } from "./products";

export interface IProductImage {
  id: number;
  image: string;
  color: string | null;
}

export interface IProvince {
  name: string;
  shipping_fee: string;
  speedy_shipping_fee: string;
}

export interface ISection {
  id: number;
  name: string;
}
export interface IUser {
  id: number;
  first_name: string | null;
  last_name: string | null;
  image: string | null;
}

export interface IProductSnapshot {
  id: number;
  name: string;
  description: string;
  video_url: string | null;
  weight: string | null;
  sizes: string;
  main_price: string;
  new_price: string;
  discount_start_date?: string | null;
  discount_end_date?: string | null;
  has_offer: boolean;
  is_out_of_stock: boolean;
  is_hidden: boolean;
  status: string;
  section: ISection;
  provinces: IProvince[];
  images: IProductImage[];
}

export interface IImagesDiff {
  added: IProductImage[];
  removed: IProductImage[];
  color_updated: IProductImage[];
}

export interface IStatusDiff {
  old: string;
  new: string;
}

export interface IDiff {
  images?: IImagesDiff;
  status?: IStatusDiff;
  reason?: string;
  [key: string]: any;
}

export interface IProductLogs {
  id: number;
  product_id: number;
  user_id: number;
  user: IUser | null;
  action: string;
  diff: IDiff;
  created_at: string;
  updated_at: string;
  snapshot: IProduct | null;
  summary: string;
}

export interface IGetLogsResponse {
  data: {
    logs: {
      current_page: number;
      data: IProductLogs[];
      last_page: number;
      total?: number;
    };
  };
}
