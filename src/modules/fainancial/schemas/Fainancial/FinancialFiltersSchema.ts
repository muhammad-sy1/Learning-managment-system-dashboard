import { z } from "zod";

export const FinancialFiltersSchema = z.object({
  page: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().optional()
  ),
  search: z.string().optional(),
});

export type FinancialFiltersSchema = z.infer<typeof FinancialFiltersSchema>;
