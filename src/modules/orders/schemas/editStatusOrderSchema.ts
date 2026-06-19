import { z } from "zod";

export const editStatusOrderSchema = (t: (key: string) => string) =>
  z.object({
    status: z.enum([
      "PROCESSING",
      "DELEVIRING",
      "COMPLETED",
      "CANCELED",
      "PREPARING",
    ]),
  });

export type EditStatusOrderSchema = z.input<
  ReturnType<typeof editStatusOrderSchema>
>;
