import { positiveNumber } from "@/schemas";
import { z } from "zod";

export const editCouponSchema = (t: (key: string) => string) =>
  z
    .object({
      code: z
        .string()
        .min(2, { message: t("codeRequired") })
        .max(50, { message: t("codeRequired") }),
      // name: z
      //   .string()
      //   .min(2, { message: t("codeRequired") })
      //   .max(50, { message: t("codeRequired") }),
      usage_limit: positiveNumber(
        t("invalidUsageLimit"),
        t("invalidUsageLimit"),
      ).nullable(),
      type: z.enum(["PERCENTAGE", "FIXED"], {
        message: t("typeRequired"),
      }),
      is_global_for_users: z.union([z.literal(0), z.literal(1)]),
      is_global_for_products: z.union([z.literal(0), z.literal(1)]).optional(),
      is_company_sponsored: z.union([z.literal(0), z.literal(1)]).optional(),
      value: positiveNumber(t("valueRequired"), t("invalidValue")),
      expires_at: z.string().min(1, { message: t("invalidExpiresAt") }),

      user_ids: z.array(z.string().or(z.number())).default([]).optional(),
      product_ids: z.array(z.string().or(z.number())).default([]).optional(),
      merchant_ids: z.array(z.string().or(z.number())).default([]).optional(),
      applies_to: z
        .enum(["PRODUCTS", "SHIPPING", "CUSTOM_ORDER_SHIPPING"])
        .default("PRODUCTS"),
      description: z.string().optional(),
      min_order_amount: z.coerce.number().min(0).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.type === "PERCENTAGE" && data.value > 100) {
        ctx.addIssue({
          path: ["value"],
          code: z.ZodIssueCode.custom,
          message: t("percentageCannotExceed100"),
        });
      }
      if (!data.is_global_for_users && data?.user_ids?.length === 0) {
        ctx.addIssue({
          path: ["user_ids"],
          code: z.ZodIssueCode.custom,
          message: t("usersRequired"),
        });
      }

      if (
        !data.is_global_for_products &&
        data?.product_ids?.length === 0 &&
        data?.merchant_ids?.length === 0
      ) {
        ctx.addIssue({
          path: ["product_ids"],
          code: z.ZodIssueCode.custom,
          message: t("productsRequired"),
        });
      }
    });

export type EditCouponSchema = z.input<ReturnType<typeof editCouponSchema>>;
