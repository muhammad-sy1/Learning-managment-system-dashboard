import { z } from "zod";

export const editProvinceSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, { message: t("min") })
      .max(100, { message: t("max") })
      .optional(),

    shipping_fee: z
      .string()
      .min(1, { message: t("invalidshippingFee") })
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val >= 0, {
        message: t("invalidshippingFee"),
      })
      .optional(),

    speedy_shipping_fee: z
      .string()
      .min(1, { message: t("invalid") })
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val) && val >= 0, {
        message: t("invalid"),
      })
      .optional(),
  });

export type editProvinceSchema = z.infer<ReturnType<typeof editProvinceSchema>>;
