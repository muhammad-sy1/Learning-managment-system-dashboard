import { positiveNumber } from "@/schemas";
import { z } from "zod";

export const addFinancialSchema = (t: (key: string) => string) =>
  z.object({
    name: z.string().min(1, { message: t("nameRequired") }),
    parent_id: positiveNumber(t("nameRequired"), t("nameRequired"))
      .refine((val) => val! > 0, { message: t("nameRequired") })
      .optional(),

    image: z
      .instanceof(File)
      .refine((file) => file.size > 0, { message: t("image.imageRequired") })
      .refine((file) => file.size <= 5 * 1024 * 1024, {
        message: t("image.fileSizeLimit"),
      })
      .refine(
        (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
        { message: t("image.fileTypeInvalid") }
      )
      .optional(),
  });

export type addFinancialSchema = z.input<ReturnType<typeof addFinancialSchema>>;
