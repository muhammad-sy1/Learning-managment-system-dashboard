export interface IHomeStatistics {
  data: {
    statistics: {
      users: {
        count: number;
      };
      products: {
        count: number;
      };
      orders: {
        count: number;
      };
      commission: {
        merchant: {
          normal_app_commission: number;
          custom_app_commission: number;
          tx_app_commission: number;
          total: number;
        };
        delivery: {
          orders_app_commission: number;
          tx_app_commission: number;
          total: number;
        };
        total: number;
        gross_total: number;
      };
    };
  };
}
