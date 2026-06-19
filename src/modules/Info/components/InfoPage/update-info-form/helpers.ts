import { UpdateInfoSchema } from "../../../schemas/UpdateInfoSchema";
import { UpdateInfoFormData } from "./types";

type AppMode = "gp" | "as" | "prod";

export const APP_MODE_OPTIONS = [
  { labelKey: "app.googlePlay", value: "gp" },
  { labelKey: "app.appStore", value: "as" },
  { labelKey: "app.production", value: "prod" },
] as const;

export const APK_FIELDS = [
  { name: "app-client_android_apk", labelKey: "app.clientAndroidApk" },
  { name: "app-merchant_android_apk", labelKey: "app.merchantAndroidApk" },
  { name: "app-delivery_android_apk", labelKey: "app.deliveryAndroidApk" },
] as const;

export const toFlag = (value?: "0" | "1") =>
  value === "1" ? 1 : value === "0" ? 0 : undefined;

const toMode = (value?: string): AppMode | undefined => {
  if (value === "gp" || value === "as" || value === "prod") {
    return value;
  }

  return undefined;
};

export const mapInfoToFormValues = (data: UpdateInfoFormData): UpdateInfoSchema => ({
  // Policies
  "general-privacy_policy_ar": data.general.privacy_policy?.ar ?? null,
  "general-privacy_policy_en": data.general.privacy_policy?.en ?? null,
  "general-delivery_note_ar": data.general.delivery_note?.ar ?? null,
  "general-delivery_note_en": data.general.delivery_note?.en ?? null,
  "general-delivery_capacity_policy_ar":
    data.general.delivery_capacity_policy?.ar ?? null,
  "general-delivery_capacity_policy_en":
    data.general.delivery_capacity_policy?.en ?? null,
  "general-terms_of_use_ar": data.general.terms_of_use?.ar ?? null,
  "general-terms_of_use_en": data.general.terms_of_use?.en ?? null,
  "general-refund_policy_ar": data.general.refund_policy?.ar ?? null,
  "general-refund_policy_en": data.general.refund_policy?.en ?? null,

  // Home entry
  "general-home_entry_floating_note_ar":
    data.general.home_entry_floating_note?.ar ?? null,
  "general-home_entry_floating_note_en":
    data.general.home_entry_floating_note?.en ?? null,
  "general-home_entry_floating_banner": null,

  // General flags and links
  "general-google_map_enabled": toFlag(data.general.google_map_enabled),
  "general-market_orders_enabled": toFlag(data.general.market_orders_enabled),
  "general-resturant_orders_enabled": toFlag(
    data.general.resturant_orders_enabled,
  ),
  "general-custom_orders_enabled": toFlag(data.general.custom_orders_enabled),
  "join_as_partner_url": data.general.join_as_partner_url ?? undefined,
  "join_as_delivery_url": data.general.join_as_delivery_url ?? undefined,

  // Social
  "social-facebook": data.social.facebook ?? "",
  "social-instagram": data.social.instagram ?? "",
  "social-whatsapp": data.social.whatsapp ?? "",

  // Coupons
  "app-coupons_text": data.app.coupons_text?.ar ?? null,

  // Versions
  "app-client_as_version": data.app.client_as_version ?? undefined,
  "app-client_gp_version": data.app.client_gp_version ?? undefined,
  "app-delivery_as_version": data.app.delivery_as_version ?? undefined,
  "app-delivery_gp_version": data.app.delivery_gp_version ?? undefined,
  "app-merchant_as_version": data.app.merchant_as_version ?? undefined,
  "app-merchant_gp_version": data.app.merchant_gp_version ?? undefined,

  // Force update
  "app-client_force_update": toFlag(data.app.client_force_update),
  "app-delivery_force_update": toFlag(data.app.delivery_force_update),
  "app-merchant_force_update": toFlag(data.app.merchant_force_update),

  // Store links
  "app-client_app_store": data.app.client_app_store ?? undefined,
  "app-client_google_play": data.app.client_google_play ?? undefined,
  "app-delivery_app_store": data.app.delivery_app_store ?? undefined,
  "app-delivery_google_play": data.app.delivery_google_play ?? undefined,
  "app-merchant_app_store": data.app.merchant_app_store ?? undefined,
  "app-merchant_google_play": data.app.merchant_google_play ?? undefined,

  // Modes
  "app-client_mode": toMode(data.app.client_mode),
  "app-delivery_mode": toMode(data.app.delivery_mode),
  "app-merchant_mode": toMode(data.app.merchant_mode),

  // Change logs
  "app-client_change_logs_ar": data.app.client_change_logs?.ar ?? null,
  "app-client_change_logs_en": data.app.client_change_logs?.en ?? null,
  "app-delivery_change_logs_ar": data.app.delivery_change_logs?.ar ?? null,
  "app-delivery_change_logs_en": data.app.delivery_change_logs?.en ?? null,
  "app-merchant_change_logs_ar": data.app.merchant_change_logs?.ar ?? null,
  "app-merchant_change_logs_en": data.app.merchant_change_logs?.en ?? null,

  // OTP
  "app-otp_text_ar": data.app.otp_text?.ar ?? null,
  "app-otp_text_en": data.app.otp_text?.en ?? null,

  // Uploads
  "app-client_android_apk": undefined,
  "app-merchant_android_apk": undefined,
  "app-delivery_android_apk": undefined,
  "general-app_tutorial_video": undefined,
  "general-merchant_tutorial_video": undefined,
  "general-delivery_tutorial_video": undefined,
});
