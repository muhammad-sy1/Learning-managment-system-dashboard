import { z } from "zod";

export const hourlyUsageSchema = z.object({
  date: z.string().optional(),
});

export type HourlyUsageSchema = z.infer<typeof hourlyUsageSchema>;
