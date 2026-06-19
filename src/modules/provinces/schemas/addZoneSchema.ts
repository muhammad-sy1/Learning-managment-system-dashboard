// import { z } from "zod";

// export const addProvinceSchema = (t: (key: string) => string) =>
//   z.object({
//     name: z
//       .string()
//       .min(2, { message: t("min") })
//       .max(100, { message: t("max") }),

//     shipping_fee: z.coerce.number().refine((val) => val >= 0, {
//       message: t("invalidshippingFee"),
//     }),

//     speedy_shipping_fee: z.coerce.number().refine((val) => val >= 0, {
//       message: t("invalid"),
//     }),
//   });


// export type addProvinceSchema = z.input<ReturnType<typeof addProvinceSchema>>;
// export type AddProvincePayload = z.output<ReturnType<typeof addProvinceSchema>>;   // للباك
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

export const addZoneSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(2, { message: t("min") })
      .max(100, { message: t("max") }),
 center: z.object({
      lat: z.number(),
      lng: z.number(),
    }),

    polygon: z
      .array(
        z.object({
          lat: z.number(),
          lng: z.number(),
        })
      )
      .min(3, { message: "Polygon must have at least 3 points" }),
  });

export type addZoneSchema = z.input<ReturnType<typeof addZoneSchema>>;
// export type AddProvincePayload = z.output<ReturnType<typeof addProvinceSchema>>;
