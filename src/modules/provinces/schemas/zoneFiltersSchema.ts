import { z } from "zod";

export const zoneFiltersSchema = z.object({
  page: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().optional()
  ),
  search: z.string().optional(),
});

export type zoneFiltersSchema = z.infer<typeof zoneFiltersSchema>;
