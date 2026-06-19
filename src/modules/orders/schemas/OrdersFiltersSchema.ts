import { z } from "zod";

export const OrdersFiltersSchema = z.object({
  page: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().optional(),
  ),
  name: z.string().optional(),
  status: z
    .string()
    .refine(() => ["PROCESSING", "DELEVIRING", "COMPLETED", "CANCELED"])
    .optional(),
  types: z.string().optional(),
});

export type OrdersFiltersSchema = z.infer<typeof OrdersFiltersSchema>;
