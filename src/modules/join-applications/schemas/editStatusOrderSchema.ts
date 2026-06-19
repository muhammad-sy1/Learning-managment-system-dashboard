import { z } from "zod";

export const editStatusApplicationsSchema = () =>
  z.object({
    status: z.enum(["approved", "rejected", "under_review", "submitted"]),
    review_note: z.string().optional(),
  });

export type EditStatusApplicationsSchema = z.input<
  ReturnType<typeof editStatusApplicationsSchema>
>;
