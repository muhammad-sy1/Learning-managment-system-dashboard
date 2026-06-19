export interface IUser {
  id: number;
  phone_number_e164: string;
  store_longitude: number | null;
  store_latitude: number | null;
  first_name: string | null;
  last_name?: string | null;
  phone_number?: string;
  country_code?: string;
  image?: string | null;
}

export interface IOrder {
  id: number;
  status: OrderStatus;
  shipping_cost: number;
  shipping_discount_amount: number;
  discount_amount: number;
  created_at: string;
  updated_at: string;
  // items_count: number;
  total_price: number;
  user: IUser;
  type?: OrderType;
  onUpdated?: () => void;
}

export type OrderStatus =
  | "PROCESSING"
  | "DELEVIRING"
  | "COMPLETED"
  | "CANCELED"
  | "PREPARING";

export interface IProductImage {
  color: string | null;
  image: string;
}

export interface IProduct {
  id: number;
  name: string;
  merchant_id: number;
  images: IProductImage[];
}

export interface IOrderItem {
  id: number;
  purchase_price: number;
  total_price: number;
  quantity: number;
  returned_quantity: number;
  size: string | null;
  color: string | null;
  product: IProduct;
}

export interface IProvince {
  id: number;
  name: string;
}

export interface IAddress {
  id: number;
  neighborhood: string;
  street: string;
  building_number: string;
  floor_number: string;
  notes: string | null;
  longitude: number | null;
  latitude: number | null;
  zone: {
    id: number;
    name: string;
  };
}

export interface IPayment {
  id: number;
  payment_method: "CASH";
}

type OrderType = "RESTURANT" | "MARKET" | "CUSTOM";

export interface IOrderByID {
  id: number;
  status: OrderStatus;
  type: OrderType;
  product_coupon_type: "PERCENTAGE" | "FIXED" | null;
  product_coupon_value: number | null;
  shipping_coupon_type: "PERCENTAGE" | "FIXED" | null;
  shipping_coupon_value: number | null;

  product_coupon: string | null;
  shipping_coupon: string | null;

  shipping_cost: number;
  discount_amount: number;
  boost_amount: number | null;

  total_purchase_price: string;
  total_price: number;

  created_at: string;
  updated_at: string;

  client_notes: string | null;
  delivery_notes: string | null;
  cancel_note: string | null;

  processing_at: string | null;
  preparing_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  canceled_at: string | null;

  delivery_rating: number | null;
  delivery_rating_comment: string | null;

  items: IOrderItem[];
  address: IAddress | null;
  user: IUser;
  payment: IPayment;
  user_id: number;
  shipping_discount_amount: string;
  stores_paid_total: number;
  stores_paid_count: number;
  stores_total_count: number;
  final_total_so_far: number;
  delivery: IDelivery;
  stores: ICustomOrderStore[];
  delivery_pricing_meta: DeliveryPricing;
}

interface StoreNetworkEdge {
  distance_m: number;
  to_merchant_id: number;
  from_merchant_id: number;
}

interface DeliveryPricing {
  fee_topup: number;
  stores_count: number;
  per_store_fee: number;
  pricing_model: string;
  base_delivery_fee: number;
  final_delivery_fee: number;
  store_handling_fees: number;
  store_network_edges: StoreNetworkEdge[];
  minimum_delivery_fee: number;
  multi_store_extra_fee: number;
  store_network_distance_m: number;
  farthest_store_merchant_id: number;
  max_store_to_customer_distance_m: number;
}

export interface IDelivery {
  first_name: string;
  last_name: string;
  image: string | null;
  id: number;
  phone_number_e164: string;
}

export interface ICustomOrderStore {
  id: number;
  items: {
    name: string;
    quantity: string;
  }[];
  items_image: string | null;
  note: string | null;
  paid_amount: number | null;
  receipt_image: string | null;
  paid_at: string | null;
  receipt_threshold: number;
  merchant: ICustomOrderMerchant;
}

export interface ICustomOrderMerchant {
  id: number;
  image: string | null;
  store_location: string;
  store_name: string;
  store_longitude: number | null;
  store_latitude: number | null;
}

export interface IGetOrdersResponse {
  data: {
    orders: {
      current_page: number;
      data: IOrder[];
      last_page: number;
      total: number;
    };
  };
}

export interface IGetOrderByIdResponse {
  data: {
    order: IOrderByID;
  };
}

export interface IUpdateOrderStatusPayload {
  status: OrderStatus;
}
