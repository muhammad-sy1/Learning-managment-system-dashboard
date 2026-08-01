const endpoints = {
  getHourlyUsageData: "/analytics/hourly",
  getHeatmapData: "/analytics/heatmap",
  getPeakHours: "/analytics/peak-hours",
  getOnlineAnalysis: "/analytics/online",
  getCurrentHour: "/analytics/current-hour",
  getAnalyticsRange: "/analytics/range",
  searchMap: "/map/search",
  //info
  getInfo: "/info",
  updateInfo: "/info",
  getApk: "/info",

  getFainancial: "/sections",
  getTransactions: "/transactions",
  updateTransaction: "/transactions/",
  deleteTransaction: "/transactions/",
  createTransaction: "/transactions",

  //Banners

  getBanners: "/banners",
  createBanner: "/banners",
  updateBanner: "/banners/",
  deleteBanner: "/banners/",

  // coupons
  getCoupons: "/coupons",
  createCoupon: "/coupons",
  updateCoupon: "/coupons/",
  deleteCoupon: "/coupons/",

  // orders
  getOrders: "/orders",
  updateOrder: "/orders/",
  getOrederById: "/orders/",
  getLogOrders: "/orders/",
  updateOrderStatus: "/orders/items/",
  assignOrder: "/orders/",

  // Applications
  getApplications: "/join-applications",
  updateApplication: "/join-applications/",
  generateApplicationContract: "/join-applications/",
  getApplicationContracts: "/join-applications/",
  cancelApplicationContract: "/join-applications/contracts/",

  //chats
  getChats: "/chat/conversations",
  getconversation: "/chat/",
  getmessages: "/chat/",
  closeConversation: "/chat/",
  updateChat: "/chats/",
  ratingsConversations: "/chat/ratings",
  deleteChat: "/chats/",

  //products
  getProducts: "/products",
  deleteProduct: "/products/",
  deleteRateProduct: "/products/ratings/",
  updateProduct: "/products/",
  createProduct: "/products",
  getProduct: "/products/",

  //sections
  getSections: "/sections",
  createSection: "/sections",
  updateSection: "/sections/",
  deleteSection: "/sections/",

  //getProvinces
  getProvinces: "/zones",
  createProvince: "/zones",
  updateProvince: "/zones/",
  deleteProvince: "/zones/",

  //getUsers
  usersFiltersList: "/lists?page=users",
  checkVerificationCode: "/auth/check/verification",
  login: "/auth/login",
  register: "/auth/register",
  getUser: "/user",
  verifyEmail: (id: string | number, hash: string) => `/auth/verify-email/${id}/${hash}`,
  resendVerification: "/auth/resend-verification",
  statistics: "/statistics",
  getProfile: "/auth/profile",
  updateProfile: "/auth/profile",
  home: "/home",
  getOrder: "/orders/",
  editOrder: "/orders/",
  logIn: "/auth/login",
  sendVerifyCode: "/auth/send/verification-code",
  resetPassword: "/auth/reset-password",
  logout: "/auth/logout",
  getZones: "/zones",
  deleteZone: "/zones/",
  createZone: "/zones",
  updateZone: "/zones/",
  downloadMerchantProducts: "/products/pdf?merchant_id=",

  getSliders: "/sliders",
  deleteSlider: "/sliders/",
  createSlider: "/sliders",
  updateSlider: "/sliders/",
  getUsers: "/users",
  getUsersCarts: "/users/carts/view",
  deleteUser: "/users/",
  updateUser: "/users/",
  createUser: "/users",
  getUserToken: (id: string | number) => `/users/${id}/token`,
  getNotifs: "/auth/notifications",
  createNotification: "/auth/notifications/pulk",
  getnotifications: "/auth/notifications",
  getContacts: "/contact-us",
  deleteContact: "/contact-us/",
  replyContactApi: "/contact-us/reply/",
  getCategories: "/sections",
  deleteCategory: "/sections/",
  createCategory: "/sections",
  updateCategory: "/sections/",

  getRatings: (id: string | number) => `/products/${id}/ratings`,
  deleteRating: (id1: string | number, id2: string | number) =>
    `/products/ratings/${id2}`,
  downlaodFile: (id: string | number) => `/products/${id}/download`,

  // merchant working hours
  getMerchantWorkingHours: (id: string | number) =>
    `/merchants/${id}/working-hours`,
  createMerchantWorkingHour: (id: string | number) =>
    `/merchants/${id}/working-hours`,
  updateMerchantWorkingHour: (id: string | number) =>
    `/merchants/working-hours/${id}`,
  deleteMerchantWorkingHour: (id: string | number) =>
    `/merchants/working-hours/${id}`,
  getMerchantCoPriceList: (id: string | number) =>
    `/merchants/${id}/co-price-list`,
  createMerchantCoPriceListItem: (id: string | number) =>
    `/merchants/${id}/co-price-list/items`,
  updateMerchantCoPriceListItem: (id: string | number) =>
    `/merchants/co-price-list/items/${id}`,
  deleteMerchantCoPriceListItem: (id: string | number) =>
    `/merchants/co-price-list/items/${id}`,
  uploadMerchantCoPriceListImage: (id: string | number) =>
    `/merchants/${id}/co-price-list/images`,
  deleteMerchantCoPriceListImage: (id: string | number) =>
    `/merchants/co-price-list/images/${id}`,
};

export default endpoints;
