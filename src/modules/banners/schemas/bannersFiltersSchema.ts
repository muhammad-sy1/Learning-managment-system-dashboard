import { z } from "zod";

export const bannersFiltersSchema = z.object({
  page: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().optional()
  ),
  type: z.enum(["PERCENTAGE", "FIXED"]).optional(),
});

export type BannersFiltersSchema = z.infer<typeof bannersFiltersSchema>;
