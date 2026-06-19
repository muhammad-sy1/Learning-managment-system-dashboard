export const TABLE_ROWS = 10;
export const PAGINATION_LIMIT = 50;

export const ROUTE_PERMISSIONS_MAP: Record<string, string[]> = {
  dashboard: ["dashboard.view"],
  statstics: ["statstics.view"],

  //users
  clients: ["clients.view"],
  "users-carts": ["clients.view"],
  merchants: ["merchants.view"],
  delivery: ["delivery.view"],
  admins: ["admins.view"],

  zones: ["zones.view"],
  coupons: ["coupons.view"],

  sections: ["sections.view"],
  "sub-sections": ["sub-sections.view"],

  "main-banners": ["main-banners.view"],
  "secondary-banners": ["secondary-banners.view"],
  "favorite-banners": ["favorite-banners.view"],
  "my-orders-banners": ["my-orders-banners.view"],

  products: ["products.view"],

  finance: ["finance.view"],
  "sub-finance": ["sub-finance.view"],
  transactions: ["transactions.view"],

  "orders-restaurant-market": ["orders.view"],
  "orders-custom": ["orders.view"],

  "join-applications-delivery": ["join-applications.view"],
  "join-applications-partner": ["join-applications.view"],

  chats: ["chats.view"],
  "chat-ratings": ["chat-ratings.view"],

  settings: ["settings.view"],
};
