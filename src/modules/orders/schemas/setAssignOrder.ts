import { z } from "zod";

export const setAssignOrder = () =>
  z.object({
    delivery_id: z.coerce.number(),
  });

export type SetAssignOrder = z.input<ReturnType<typeof setAssignOrder>>;
