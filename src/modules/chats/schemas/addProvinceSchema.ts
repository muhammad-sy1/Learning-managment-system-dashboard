
import { z } from "zod";

const positiveNumber = (requiredMessage: string, invalidMessage: string) =>
  z.preprocess(
    (val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      return Number(val);
    },
    z
      .number({ message: requiredMessage })
      .refine((val) => val >= 0, { message: invalidMessage })
  );

export const addProvinceSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, { message: t("min") })
      .max(100, { message: t("max") }),

    shipping_fee: positiveNumber(
      t("invalidshippingFee"),
      t("invalidshippingFee")
    ),
    speedy_shipping_fee: positiveNumber(t("invalid"), t("invalid")),
  });

export type addProvinceSchema = z.input<ReturnType<typeof addProvinceSchema>>;
// export type AddProvincePayload = z.output<ReturnType<typeof addProvinceSchema>>;
