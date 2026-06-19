import { z } from "zod";

const VIDEO_MIME_TYPES = [
  "video/mp4",
  "video/quicktime",
  "video/x-msvideo",
  "video/webm",
];
const MAX_VIDEO_SIZE_MB = 100;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;

const videoUploadSchema = (
  t: (key: string, vars?: Record<string, number>) => string,
) =>
  z
    .file()
    .refine((file) => VIDEO_MIME_TYPES.includes(file.type), {
      message: t("videoFileType"),
    })
    .refine((file) => file.size <= MAX_VIDEO_SIZE_BYTES, {
      message: t("videoMaxSize", { max: MAX_VIDEO_SIZE_MB }),
    })
    .optional()
    .nullable();

export const updateInfoSchema = (
  t: (key: string, vars?: Record<string, number>) => string,
) =>
  z.object({
    // General
    "general-privacy_policy_ar": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "general-privacy_policy_en": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "general-delivery_note_ar": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "general-delivery_note_en": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "general-terms_of_use_ar": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "general-terms_of_use_en": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "general-refund_policy_ar": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "general-refund_policy_en": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "app-coupons_text": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "general-home_entry_floating_note_ar": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "general-home_entry_floating_note_en": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "general-home_entry_floating_banner": z
      .file()
      .min(1, { message: t("validation.imageRequired") })
      .optional()
      .nullable(),
    "general-google_map_enabled": z
      .union([z.literal(0), z.literal(1)])
      .optional(),
    "general-market_orders_enabled": z
      .union([z.literal(0), z.literal(1)])
      .optional(),
    "general-resturant_orders_enabled": z
      .union([z.literal(0), z.literal(1)])
      .optional(),
    "general-custom_orders_enabled": z
      .union([z.literal(0), z.literal(1)])
      .optional(),
    "general-delivery_capacity_policy_ar": z
      .string()
      .max(5000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "general-delivery_capacity_policy_en": z
      .string()
      .max(5000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "general-custom_delivery_note_ar": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "general-custom_delivery_note_en": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "general-app_tutorial_video": videoUploadSchema(t),
    "general-merchant_tutorial_video": videoUploadSchema(t),
    "general-delivery_tutorial_video": videoUploadSchema(t),

    // App
    "app-client_as_version": z.string().optional(),
    "app-client_gp_version": z.string().optional(),
    "app-delivery_as_version": z.string().optional(),
    "app-delivery_gp_version": z.string().optional(),
    "app-merchant_as_version": z.string().optional(),
    "app-merchant_gp_version": z.string().optional(),
    "app-client_force_update": z.union([z.literal(0), z.literal(1)]).optional(),
    "app-delivery_force_update": z
      .union([z.literal(0), z.literal(1)])
      .optional(),
    "app-merchant_force_update": z
      .union([z.literal(0), z.literal(1)])
      .optional(),
    "app-client_app_store": z
      .string()
      .url({ message: t("invalidUrl") })
      .optional(),
    "app-client_google_play": z
      .string()
      .url({ message: t("invalidUrl") })
      .optional(),
    "app-delivery_app_store": z
      .string()
      .url({ message: t("invalidUrl") })
      .optional(),
    "app-delivery_google_play": z
      .string()
      .url({ message: t("invalidUrl") })
      .optional(),
    "app-merchant_app_store": z
      .string()
      .url({ message: t("invalidUrl") })
      .optional(),
    "app-merchant_google_play": z
      .string()
      .url({ message: t("invalidUrl") })
      .optional(),
    "app-client_mode": z.enum(["gp", "as", "prod"]).optional(),
    "app-delivery_mode": z.enum(["gp", "as", "prod"]).optional(),
    "app-merchant_mode": z.enum(["gp", "as", "prod"]).optional(),
    "app-client_change_logs_ar": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "app-client_change_logs_en": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "app-delivery_change_logs_ar": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "app-delivery_change_logs_en": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "app-merchant_change_logs_ar": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "app-merchant_change_logs_en": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "app-otp_text_ar": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    "app-otp_text_en": z
      .string()
      .max(50000, { message: t("maxLength", { max: 50000 }) })
      .optional()
      .nullable(),
    join_as_partner_url: z
      .string()
      .url({ message: t("invalidUrl") })
      .optional(),
    join_as_delivery_url: z
      .string()
      .url({ message: t("invalidUrl") })
      .optional(),
    "app-client_android_apk": z.file().optional(),
    "app-merchant_android_apk": z.file().optional(),
    "app-delivery_android_apk": z.file().optional(),

    // Social
    "social-whatsapp": z
      .string()
      .url({ message: t("invalidUrl") })
      .optional()
      .or(z.literal(""))
      .optional(),
    "social-facebook": z
      .string()
      .url({ message: t("invalidUrl") })
      .optional()
      .or(z.literal("")),
    "social-instagram": z
      .string()
      .url({ message: t("invalidUrl") })
      .optional()
      .or(z.literal("")),
  });

export type UpdateInfoSchema = z.input<ReturnType<typeof updateInfoSchema>>;
