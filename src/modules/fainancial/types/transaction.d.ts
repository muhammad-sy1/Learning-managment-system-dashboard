// import { categoryOptions } from "./../components/transactionsTable/AddTransactionForm";
export type TransactionCurrency = "SYP" | "USD";

export interface ITransaction {
  id: number;
  description: string;
  amount: string;
  // type: "+" | "-";
  section_id: number;
  created_at: string;
  updated_at: string;
  date: string;
  actor?:
    | {
        id: number;
        first_name: string;
        last_name: string;
      }
    | null;
  currency?: TransactionCurrency | null;
  category: "order_discount" | "shipping_discount" | "app_commission" | "other";
  section: {
    id: number;
    name: string;
    parent: {
      id: number;
      name: string;
    };
  };
}
export interface ISectionTransaction {
  id: number;
  name: string;
}

export interface IGetTransactionsResponse {
  data: {
    parent_section?: ITransaction;
    total_spends: number;
    total_earnings: number;
    net_profit: number;

    transactions: {
      current_page: number;
      data: ITransaction[];
      last_page: number;
      total?: number;
    };
  };
}

export interface ICreateTransactionPayload {
  name: string;
  image?: File;
}

export interface TransactionFilters {
  page?: number;
  search?: string;
  type?: string;
  end_date?: string;
  start_date?: string;
  name?: string;
  section_id?: string | null;
  sub_section_id?: string | null;
  currency?: TransactionCurrency;
}
