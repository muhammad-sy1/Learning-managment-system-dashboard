import { z } from "zod";

export const chatsFiltersSchema = z.object({
  page: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().optional()
  ),
  search: z.string().optional(),
  status: z.string().optional(),
  conversation: z.preprocess(
    (val) => Number(val),
    z.number().int().positive().optional()
  ),
  range: z
    .string()
    .refine(() => ["OPEN", "CLOSED", "RATED"])
    .optional(),
});

export type chatsFiltersSchema = z.infer<typeof chatsFiltersSchema>;
