import { positiveNumber } from "@/schemas";
import { z } from "zod";

export const editFinancialSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, { message: t("nameRequired") })
      .optional(),
    parent_id: positiveNumber(t("nameRequired"), t("nameRequired"))
      .refine((val) => val! > 0, { message: t("nameRequired") })
      .optional(),

    image: z
      .union([z.instanceof(File), z.string(), z.null(), z.undefined()])
      .refine(
        (value) => {
          if (!value || typeof value === "string") return true;
          return value.size <= 5 * 1024 * 1024;
        },
        { message: t("image.fileSizeLimit") }
      )
      .refine(
        (value) => {
          if (!value || typeof value === "string") return true;
          return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
        },
        { message: t("image.fileTypeInvalid") }
      )
      .optional(),
  });

export type editFinancialSchema = z.input<ReturnType<typeof editFinancialSchema>>;
