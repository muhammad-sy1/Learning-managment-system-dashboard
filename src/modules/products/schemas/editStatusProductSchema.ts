import { z } from "zod";

export const editStatusProductSchema = (t: (key: string) => string) =>
  z
    .object({
      status: z.enum(["APPROVED", "REJECTED", "PENDING"]),
      reject_reason: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.status === "REJECTED") {
        if (!data.reject_reason || data.reject_reason.trim().length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["reject_reason"],
            message: t("validation.reject_reasonRequired"),
          });
        }
      }
    }).transform((data) => {
      if (data.status !== "REJECTED") {
        delete (data as any).reject_reason;
      }
      return data;
    });

export type EditStatusProductSchema = z.input<
  ReturnType<typeof editStatusProductSchema>
>;
