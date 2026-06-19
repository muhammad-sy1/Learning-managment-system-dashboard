import { positiveNumber, positiveNumberOptional } from "@/schemas";
import { z } from "zod";

const imageSchema = z
  .object({
    serverId: z.number().optional(),
    file: z.instanceof(File).nullable().optional(),
    url: z.string().optional(),
    color: z.string().nullable().optional(),
    isPreview: z.boolean().optional(),
    markedForDelete: z.boolean().optional(),
    is_blur: z.number().optional(),

  })
  .refine((data) => data.file instanceof File || !!data.url, {
    message: "الصورة لازم يكون إلها ملف أو رابط",
  });

export const editProductSchema = (
  t: (key: string) => string,
  isSupProduct?: boolean,
) => {
  const baseSchema = z.object({
    section_id: positiveNumber(
      t("validation.sectionRequired"),
      t("validation.sectionRequired"),
    )
      .refine((val) => val! > 0, { message: t("validation.sectionRequired") })
      .optional(),
    sub_section_id: positiveNumberOptional(t("validation.sectionIdRequired")),

    type: z.string().optional(),
    merchant_id: positiveNumber(
      t("validation.merchantRequired"),
      t("validation.merchantRequired"),
    )
      .refine((val) => val! > 0, { message: t("validation.merchantRequired") })
      .optional(),
    name: z.string().min(1, { message: t("validation.nameRequired") }),
    description: z
      .string()
      .min(1, { message: t("validation.descriptionRequired") })
      .optional(),
    main_price: positiveNumber(
      t("validation.priceRequired"),
      t("validation.priceRequired"),
    )
      .refine((val) => val! > 0, { message: t("validation.priceRequired") })
      .optional(),
    new_price: positiveNumberOptional(t("validation.priceRequired")).optional(),
    main_price_usd: positiveNumber(
      t("validation.priceRequired"),
      t("validation.priceRequired"),
    )
      .refine((val) => val! > 0, { message: t("validation.priceRequired") })
      .nullable(),
    new_price_usd: positiveNumberOptional(t("validation.priceRequired"))
      .optional()
      .nullable(),
    is_price_linked_to_usd: z.number().optional().nullable(),
    weight: z.string().optional(),
    is_out_of_stock: z.number().optional(),
    discount_start_date: z.string().nullable().optional(),
    discount_end_date: z.string().nullable().optional(),
    sizes: z.array(z.string()).optional(),
    options: z.union([z.array(z.string()), z.string()]).optional(),
    // imag_delete: z.array(z.number()).optional(),
    video_url: z
      .string()
      .url({ message: t("validation.invalidUrl") })
      .or(z.literal(""))
      .optional().nullable(),
    zones_ids: z
      .array(positiveNumber(t("validation.invalid"), t("validation.invalid")))
      .optional(),
    old_images_to_delete: z.array(z.number()).optional(),
    is_refundable: z.number().optional(),

  });

  if (!isSupProduct) {
    return baseSchema.extend({
      images: z
        .array(imageSchema)
        .min(1, { message: t("validation.imageRequired") }),
    });
  }

  return baseSchema.extend({
    images: z.array(z.any()).optional(),
  });
};

export type EditProductSchema = z.input<ReturnType<typeof editProductSchema>>; // output (numbers after coerce)
