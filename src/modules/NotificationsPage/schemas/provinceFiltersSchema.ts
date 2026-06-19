import { z } from "zod";

export const provinceFiltersSchema = z.object({
  page: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().optional()
  ),
  name: z.string().optional(),
});

export type provinceFiltersSchema = z.infer<typeof provinceFiltersSchema>;
