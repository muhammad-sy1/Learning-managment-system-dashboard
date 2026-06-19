import { z } from "zod";

export const SectionFiltersSchema = z.object({
  page: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().optional(),
  ),
  search: z.string().optional(),
  type: z.string(),
  name: z.string().optional(),
  parent_id: z.string().optional(),
});

export type SectionFiltersSchema = z.infer<typeof SectionFiltersSchema>;
