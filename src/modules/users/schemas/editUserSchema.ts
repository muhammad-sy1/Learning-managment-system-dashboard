import { positiveNumber } from "@/schemas";
import { isValidPhoneNumber } from "react-phone-number-input";
import z from "zod";

export const editUserSchema = (
  t: (key: string) => string,
  role: string | null,
) =>
  z
    .object({
      first_name: z
        .string()
        .min(2, { message: t("first_name.min") })
        .max(100, { message: t("first_name.max") })
        .optional(),
      last_name: z
        .string()
        .min(2, { message: t("last_name.min") })
        .max(100, { message: t("last_name.max") })
        .optional(),
      store_type: z.string().optional(),
      store_category: z.string().optional(),

      email: z.email({ message: t("email") }).optional(),

      phone_number: z.string().refine((val) => isValidPhoneNumber(val), {
        message: t("phone.invalid"),
      }).optional(),
      country_code: z.string().optional(),

      supports_custom_order: z.coerce.string()
        .refine(val => val === "0" || val === "1")
        .optional(),
      supports_normal_order: z.coerce.string()
        .refine(val => val === "0" || val === "1")
        .optional(),

      app_commession:
        role === "MERCHANT"
          ? positiveNumber(
            t("fieldRequired"),
            t("app_commission.invalid"),
            true,
            100,
          )
          : positiveNumber(
            t("fieldRequired"),
            t("app_commission.invalid"),
            true,
            100,
          ).optional(),
      store_latitude: z.string().optional(),
      store_longitude: z.string().optional(),
      store_name: z.string().optional(),
      store_location: z.string().optional(),
      store_name_slug: z.string().optional(),
      password: z
        .string()
        .optional()
        .refine((val) => !val || (val.length >= 8 && val.length <= 50), {
          message: t("password.required"),
        })
        .refine((val) => !val || /^[^\s]+$/.test(val), {
          message: t("password.noSpaces"),
        }),

      role: z
        .enum(["ADMIN", "CLIENT", "MERCHANT", "DELIVERY", "SUPER_ADMIN"], {
          message: t("role.invalid"),
        })
        .optional(),

      image: z
        .union([z.instanceof(File), z.string(), z.null(), z.undefined()])
        .refine(
          (value) => {
            if (!value || typeof value === "string") return true;
            return value.size <= 5 * 1024 * 1024;
          },
          { message: t("image.fileSizeLimit") },
        )
        .refine(
          (value) => {
            if (!value || typeof value === "string") return true;
            return ["image/jpeg", "image/png", "image/jpg"].includes(
              value.type,
            );
          },
          { message: t("image.fileTypeInvalid") },
        )
        .optional(),
      cover_image: z
        .union([z.instanceof(File), z.string(), z.null(), z.undefined()])
        .refine(
          (value) => {
            if (!value || typeof value === "string") return true;
            return value.size <= 5 * 1024 * 1024;
          },
          { message: t("image.fileSizeLimit") },
        )
        .refine(
          (value) => {
            if (!value || typeof value === "string") return true;
            return ["image/jpeg", "image/png", "image/jpg"].includes(
              value.type,
            );
          },
          { message: t("image.fileTypeInvalid") },
        )
        .optional(),
      permissions: z.array(z.string()).optional(),

      // DELIVERY ONLY
      is_delivery_manager:
        role === "DELIVERY"
          ? z.enum(["0", "1"], { message: t("chooseRequired") }).optional()
          : z.enum(["0", "1"], { message: t("chooseRequired") }).optional(),

      delivery_manager_id: z.coerce.number().optional(),

      zones_ids: z.array(z.coerce.number()).optional(),

      is_delivery_admin: z
        .enum(["0", "1"], { message: t("chooseRequired") })
        .optional(),

      is_delivery_office_worker: z
        .enum(["0", "1"], { message: t("chooseRequired") })
        .optional(),
      usd_to_syp_rate: positiveNumber(
        t("fieldRequired"),
        t("usd_to_syp_rate.invalid"),
        true,
      )
        .optional()
        .nullable(),
    })
    .superRefine((data, ctx) => {
      if (data.app_commession && data.app_commession > 100) {
        ctx.addIssue({
          path: ["app_commession"],
          message: t("app_commission.max"),
          code: z.ZodIssueCode.custom,
        });
      }
      if (role === "DELIVERY") {
        if (!Array.isArray(data.zones_ids) || data.zones_ids.length === 0) {
          ctx.addIssue({
            path: ["zones_ids"],
            message: t("chooseRequired"),
            code: z.ZodIssueCode.custom,
          });
        }

        if (data.is_delivery_admin == null) {
          ctx.addIssue({
            path: ["is_delivery_admin"],
            message: t("chooseRequired"),
            code: z.ZodIssueCode.custom,
          });
        }

        if (data.is_delivery_admin === "0") {
          if (data.is_delivery_manager == null) {
            ctx.addIssue({
              path: ["is_delivery_manager"],
              message: t("chooseRequired"),
              code: z.ZodIssueCode.custom,
            });
          }

          if (data.is_delivery_manager === "0") {
            if (data.is_delivery_office_worker == null) {
              ctx.addIssue({
                path: ["is_delivery_office_worker"],
                message: t("chooseRequired"),
                code: z.ZodIssueCode.custom,
              });
            }

            if (data.is_delivery_office_worker === "1") {
              if (!data.delivery_manager_id) {
                ctx.addIssue({
                  path: ["delivery_manager_id"],
                  message: t("chooseRequired"),
                  code: z.ZodIssueCode.custom,
                });
              }
            }
          }
        }
      }
    });

export type editUserSchema = z.input<ReturnType<typeof editUserSchema>>;
