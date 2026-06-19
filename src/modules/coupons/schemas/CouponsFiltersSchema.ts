import { z } from "zod";

export const couponsFiltersSchema = z.object({
  page: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().optional()
  ),
  code: z.string().optional(),
});

export type CouponsFiltersSchema = z.infer<typeof couponsFiltersSchema>;
