import { z } from "zod";

export const productFiltersSchema = z.object({
  page: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().optional(),
  ),
  search: z.string().optional(),
  name: z.string().optional(),
  merchant_id: z.number().optional(),
  status: z.string().optional(),
  section_id: z.number().optional(),

  parent_id: z.number().optional(),
  product_id: z.number().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  sort_by: z.string().optional(),
  is_final_reviewed: z.string().optional(),
});

export type ProductFiltersSchema = z.infer<typeof productFiltersSchema>;
