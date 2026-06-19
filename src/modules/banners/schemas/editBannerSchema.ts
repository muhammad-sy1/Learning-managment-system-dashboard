import { imageSchemaOptional, positiveNumber } from "@/schemas";
import { z } from "zod";
const videoSchema = () =>
  z
    .instanceof(File)
    .refine(
      (file) => ["video/mp4", "video/mov", "video/avi"].includes(file.type),
      {
        message: "Only .mp4, .mov, .avi formats are supported",
      }
    )
    .optional();
export const editBannerSchema = (t: (key: string) => string) =>
  z.object({
    file: z.union([imageSchemaOptional(), videoSchema()]),
    expires_at: z
      .string()
      .min(1, { message: t("expiresAtRequired") })
      .optional(),
    url: z
      .string()
      .url({ message: t("invalidUrl") })
      .optional()
      .or(z.literal("")),
    product_id: positiveNumber(
      t("invalidProductId"),
      t("invalidProductId")
    ).optional(),
    target: z.enum(["url", "product"]),
    show_time: positiveNumber(
      t("showTimeRequired"),
      t("invalidShowTime")
    ).optional(),
  });

export type EditBannerSchema = z.input<ReturnType<typeof editBannerSchema>>;
