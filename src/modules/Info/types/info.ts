// import { ApplicationsFilters } from '@/modules/join-applications/components/filters/ApplicationsFilters';
export interface IGeneralInfo {
  // Policies (HTML)
  privacy_policy?: TranslatedText;
  refund_policy?: TranslatedText;
  terms_of_use?: TranslatedText;
  delivery_note?: TranslatedText;

  // Maps
  google_map_enabled?: forceUpdate;

  // Orders limits
  resturant_order_max_total?: string;
  market_order_max_total?: string;

  // Orders toggles
  market_orders_enabled?: forceUpdate;
  resturant_orders_enabled?: forceUpdate;
  custom_orders_enabled?: forceUpdate;

  // Home Entry
  home_entry_floating_note?: TranslatedText;
  home_entry_floating_banner?: string;

  // Applications
  join_as_delivery_url?: string;
  join_as_partner_url?: string;

  delivery_capacity_policy?: TranslatedText;

  custom_delivery_note?: TranslatedText;
  app_tutorial_video?: string;
  merchant_tutorial_video?: string;
  delivery_tutorial_video?: string;
}

export interface ISocialInfo {
  facebook: string;
  instagram: string;
  whatsapp: string;
}

export interface IAppInfo {
  // Coupons
  coupons_text?: TranslatedText | null;

  // Client
  client_as_version?: string;
  client_gp_version?: string;
  client_force_update?: forceUpdate;
  client_app_store?: string;
  client_google_play?: string;
  client_mode?: string;
  client_change_logs?: TranslatedText | null;
  client_android_apk?: string;

  // Delivery
  delivery_as_version?: string;
  delivery_gp_version?: string;
  delivery_force_update?: forceUpdate;
  delivery_app_store?: string;
  delivery_google_play?: string;
  delivery_mode?: string;
  delivery_change_logs?: TranslatedText | null;
  delivery_android_apk?: string;

  // Merchant
  merchant_as_version?: string;
  merchant_gp_version?: string;
  merchant_force_update?: forceUpdate;
  merchant_app_store?: string;
  merchant_google_play?: string;
  merchant_mode?: string;
  merchant_change_logs?: TranslatedText | null;
  merchant_android_apk?: string;

  // OTP
  otp_text?: TranslatedText | null;
}

// export type appMode = "gp" | "as" | "prod";

export type forceUpdate = "0" | "1";

type TranslatedText = {
  ar: string;
  en: string;
};

export interface IInfoResponse {
  data: {
    info: {
      general: IGeneralInfo;
      social: ISocialInfo;
      app: IAppInfo;
    };
  };
}
