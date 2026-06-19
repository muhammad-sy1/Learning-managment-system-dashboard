import { z } from "zod";

export const StatisticsFiltersSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  range: z
      .string()
      .refine(() => ["day", "week", "month", "year"])
      .optional(),
});

export type StatisticsFiltersSchema = z.infer<typeof StatisticsFiltersSchema>;
