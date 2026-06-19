import { positiveNumber } from "@/schemas";
import { isValidPhoneNumber } from "react-phone-number-input";
import z from "zod";

export interface Permission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export const addUserSchema = (
  t: (key: string) => string,
  role: string | null,
) =>
  z
    .object({
      first_name: z
        .string({ message: t("fieldRequired") })
        .min(2, { message: t("first_name.min") })
        .max(100, { message: t("first_name.max") }),
      last_name: z
        .string({ message: t("fieldRequired") })
        .min(2, { message: t("last_name.min") })
        .max(100, { message: t("last_name.max") }),
      email: z.email({ message: t("email") }).optional(),
      store_type: z.string().optional(),
      phone_number: z
        .string({ message: t("fieldRequired") })
        .refine((val) => isValidPhoneNumber(val), {
          message: t("phone.invalid"),
        }),
      role: z
        .enum(["CLIENT", "MERCHANT", "DELIVERY", "ADMIN"], {
          message: t("role.invalid"),
        })
        .optional(),
      password: z.string().optional(),
      store_name: z.string().optional(),
      store_location: z.string().optional(),
      store_category: z.string().optional(),
      store_latitude: z.string().optional(),
      store_longitude: z.string().optional(),
      supports_custom_order: z
        .union([z.literal("0"), z.literal("1")])
        .optional(),
      supports_normal_order: z
        .union([z.literal("0"), z.literal("1")])
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
      image: z
        .union([z.instanceof(File), z.null(), z.undefined()])
        .refine(
          (value) => {
            if (!value) return true;
            return value.size <= 5 * 1024 * 1024;
          },
          {
            message: t("image.fileSizeLimit"),
          },
        )
        .refine(
          (value) => {
            if (!value) return true;
            return ["image/jpeg", "image/png", "image/jpg"].includes(
              value.type,
            );
          },
          {
            message: t("image.fileTypeInvalid"),
          },
        )
        .optional(),
      cover_image: z
        .union([z.instanceof(File), z.null(), z.undefined()])
        .refine(
          (value) => {
            if (!value) return true;
            return value.size <= 5 * 1024 * 1024;
          },
          {
            message: t("image.fileSizeLimit"),
          },
        )
        .refine(
          (value) => {
            if (!value) return true;
            return ["image/jpeg", "image/png", "image/jpg"].includes(
              value.type,
            );
          },
          {
            message: t("image.fileTypeInvalid"),
          },
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
      if (role === "ADMIN") {
        if (!data.password) {
          ctx.addIssue({
            path: ["password"],
            message: t("password.required"),
            code: z.ZodIssueCode.custom,
          });
        } else if (data.password.length < 8) {
          ctx.addIssue({
            path: ["password"],
            message: t("password.min"),
            code: z.ZodIssueCode.custom,
          });
        } else if (data.password.length > 50) {
          ctx.addIssue({
            path: ["password"],
            message: t("password.max"),
            code: z.ZodIssueCode.custom,
          });
        }
      }

      if (role === "MERCHANT") {
        if (!data.zones_ids?.length) {
          ctx.addIssue({
            path: ["zones_ids"],
            message: t("chooseRequired"),
            code: z.ZodIssueCode.custom,
          });
        }
        if (!data.store_name) {
          ctx.addIssue({
            path: ["store_name"],
            message: t("store_name.required"),
            code: z.ZodIssueCode.custom,
          });
        }
        if (!data.store_location) {
          ctx.addIssue({
            path: ["store_location"],
            message: t("store_location.required"),
            code: z.ZodIssueCode.custom,
          });
        }
        if (!data.store_category && data.store_type === "MARKET") {
          ctx.addIssue({
            path: ["store_category"],
            message: t("store_category.required"),
            code: z.ZodIssueCode.custom,
          });
        }
        if (!data.store_type) {
          ctx.addIssue({
            path: ["store_type"],
            message: t("store_type.required"),
            code: z.ZodIssueCode.custom,
          });
        }
        if (!data.store_latitude || !data.store_longitude) {
          ctx.addIssue({
            path: ["store_latitude"],
            message: t("supports_normal_order.required"),
            code: z.ZodIssueCode.custom,
          });
        }
        if (!data.supports_custom_order) {
          ctx.addIssue({
            path: ["supports_custom_order"],
            message: t("supports_custom_order.required"),
            code: z.ZodIssueCode.custom,
          });
        }

        if (!data.supports_normal_order) {
          ctx.addIssue({
            path: ["supports_normal_order"],
            message: t("supports_normal_order.required"),
            code: z.ZodIssueCode.custom,
          });
        }
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

      if (data.app_commession && data.app_commession > 100) {
        ctx.addIssue({
          path: ["app_commession"],
          message: t("app_commission.max"),
          code: z.ZodIssueCode.custom,
        });
      }
    });

export type addUserSchema = z.input<ReturnType<typeof addUserSchema>>;
