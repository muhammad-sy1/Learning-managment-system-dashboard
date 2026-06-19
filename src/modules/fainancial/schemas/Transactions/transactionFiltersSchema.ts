import { z } from "zod";

export const transactionFiltersSchema = z.object({
  page: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().optional()
  ),
  serch: z.string().optional(),
  currency: z.enum(["SYP", "USD"]).optional(),
});

export type transactionFiltersSchema = z.infer<typeof transactionFiltersSchema>;
