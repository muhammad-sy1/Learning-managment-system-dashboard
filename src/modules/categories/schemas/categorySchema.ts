import { positiveNumber } from "@/schemas";
import { z } from "zod";

export const categorySchema = (t: (key: string) => string) =>
    z.object({
        name: z.string().min(1, { message: t("nameRequired") }),
        student_type: z.string().min(1, { message: t("studentTypeRequired") }),
        parent_id: positiveNumber(t("parentCategoryRequired"), t("parentCategoryRequired"))
            .optional(),
        is_active: z
            .union([z.literal(0), z.literal(1), z.boolean()])
            .transform((value) => (value === true ? 1 : value === false ? 0 : value)),
    });

export type CategorySchemaInput = z.input<ReturnType<typeof categorySchema>>;
