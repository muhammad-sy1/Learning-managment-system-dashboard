import { z } from "zod";

export const applicationsFiltersSchema = z.object({
  page: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().optional(),
  ),
  name: z.string().optional(),
  status: z
    .string()
    .refine((value) =>
      ["submitted", "under_review", "approved", "rejected"].includes(value),
    )
    .optional(),
  // types: z.string().optional(),
  search: z.string().optional(),
  type: z.string().optional(),
});

export type ApplicationsFiltersSchema = z.infer<
  typeof applicationsFiltersSchema
>;
