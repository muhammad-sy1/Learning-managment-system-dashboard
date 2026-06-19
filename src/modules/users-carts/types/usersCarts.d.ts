export interface IUserCartPerson {
  id: number;
  name: string;
  phone_number_e164: string | null;
}

export interface IUserCartSummary {
  items_count: number;
  total_quantity: number;
  total_price: number | string;
  merchants_count?: number;
}

export interface IUserCartProductImage {
  id?: number;
  image?: string;
  url?: string;
  color?: string | null;
}

export interface IUserCartProduct {
  id: number;
  description?: string | null;
  name: string;
  new_price: number | string;
  main_price?: number | string | null;
  discount_start_date?: string | null;
  discount_end_date?: string | null;
  is_out_of_stock?: 0 | 1;
  has_discount?: boolean;
  is_available_now?: boolean;
  image?: string | null;
  main_image?: string | null;
  images?: IUserCartProductImage[];
}

export interface IUserCartItem {
  id: number;
  quantity: number;
  size: string | null;
  option: string | null;
  color: string | null;
  product: IUserCartProduct;
}

export interface IMerchantCart {
  merchant: IUserCartPerson;
  cart_summary: Omit<IUserCartSummary, "merchants_count">;
  cart_items: IUserCartItem[];
}

export interface IUserCart {
  user: IUserCartPerson;
  cart_summary: IUserCartSummary;
  merchant_carts: IMerchantCart[];
}

export interface IUsersCartsPagination {
  current_page: number;
  data: IUserCart[];
  last_page: number;
  total: number;
}

export interface IGetUsersCartsResponse {
  data: {
    users: IUsersCartsPagination;
  };
}

export interface UsersCartsFilters {
  page: number;
  merchant_id?: string;
  user_id?: string;
}
