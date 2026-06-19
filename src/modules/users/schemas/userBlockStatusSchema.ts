// schemas/userBlockStatusSchema.ts
import { z } from "zod";

export const userBlockStatusSchema = (t: (key: string) => string) =>
  z.object({
    block: z.union([z.number(),z.string(), z.null()]),
  });

export type UserBlockStatusSchema = z.input<ReturnType<typeof userBlockStatusSchema>>;
