import { z } from "zod";

export const rangeAnalysisSchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
});

export type RangeAnalysisSchema = z.infer<typeof rangeAnalysisSchema>;
