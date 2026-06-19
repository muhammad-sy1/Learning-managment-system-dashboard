import { positiveNumber, positiveNumberOptional } from "@/schemas";
import { z } from "zod";

const imageSchema = z.object({
  file: z.instanceof(File).optional(),
  url: z.string(),
  color: z.string().nullable().optional(),
  is_blur:z.number().optional(),
});

export const addProductSchema = (
  t: (key: string) => string,
  isSupProduct?: boolean,
) => {
  const baseSchema = z.object({
    section_id: positiveNumberOptional(t("validation.sectionRequired")),
    sub_section_id: positiveNumberOptional(t("validation.sectionIdRequired")),
    // section_id: positiveNumber(
    //   t("validation.sectionRequired"),
    //   t("validation.sectionRequired")
    // ).refine((val) => val! > 0, { message: t("validation.sectionRequired") }),
    merchant_id: positiveNumber(
      t("validation.merchantRequired"),
      t("validation.merchantRequired"),
    ).refine((val) => val! > 0, { message: t("validation.merchantRequired") }),
    name: z.string().min(1, { message: t("validation.nameRequired") }),
    description: z
      .string()
      .min(1, { message: t("validation.descriptionRequired") }),
    main_price: positiveNumber(
      t("validation.priceRequired"),
      t("validation.priceRequired"),
    ).refine((val) => val! > 0, { message: t("validation.priceRequired") }),
    new_price: positiveNumberOptional(t("validation.priceRequired")).optional(),
    main_price_usd: positiveNumberOptional(t("validation.priceRequired"))
      .optional()
      .nullable(),
    new_price_usd: positiveNumberOptional(t("validation.priceRequired"))
      .optional()
      .nullable(),
    is_price_linked_to_usd: z.enum(["0", "1"]).optional().nullable(),
    weight: z.string().optional(),
    is_out_of_stock: z.number().optional(),
    discount_start_date: z.string().nullable().optional(),
    discount_end_date: z.string().nullable().optional(),
    avg_preparation_minutes: z.string().nullable().optional(),
    sizes: z.array(z.string()).optional(),
    options: z.array(z.string()).optional(),

    video_url: z
      .string()
      .url({ message: t("validation.invalidUrl") })
      .or(z.literal(""))
      .optional(),
    zones_ids: z
      .array(positiveNumber(t("validation.invalid"), t("validation.invalid")))
      .optional(),
    is_refundable: z.number().optional(),
  });

  const schemaWithImages = !isSupProduct
    ? baseSchema.extend({
      images: z
        .array(imageSchema)
        .min(1, { message: t("validation.imageRequired") }),
    })
    : baseSchema.extend({
      images: z.array(z.any()).optional(),
    });

  return schemaWithImages.superRefine((data, ctx) => {
    if (data.is_price_linked_to_usd === "1") {
      const mainUsd = data.main_price_usd;
      if (mainUsd === undefined || mainUsd === null || mainUsd <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["main_price_usd"],
          message: t("validation.priceRequired"),
        });
      }
    }
  });
};

export type AddProductFormValues = z.input<ReturnType<typeof addProductSchema>>;
