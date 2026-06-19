// schemas/Transactions/addTransactionSchema.ts
import { positiveNumber } from "@/schemas";
import { z } from "zod";

export const addTransactionSchema = (t: (key: string) => string) =>
  z
    .object({
      description: z
        .string()
        .min(1, { message: t("validation.descriptionRequired") }),
      amount: z.string().min(1, { message: t("validation.amountRequired") }),
      // type: z
      //   .enum(["+", "-"])
      //   .optional()
      //   .refine((val) => val !== undefined, {
      //     message: t("validation.typeRequired"),
      //   }),

      section_id: positiveNumber(
        t("validation.sectionIdRequired"),
        t("validation.sectionIdRequired"),
      ).optional(),
      sub_section_id: positiveNumber(
        t("validation.sectionIdRequired"),
        t("validation.sectionIdRequired"),
      ).optional(),
      date: z.string().optional(),
      actor_id: positiveNumber(
        t("validation.actorIdRequired"),
        t("validation.actorIdRequired"),
      ).optional(),
      currency: z.enum(["SYP", "USD"], {
        message: t("validation.currencyRequired"),
      }),
      category: z
        .enum(["order_discount", "shipping_discount", "app_commission", "other"])
        .optional(),
    })
    .superRefine((values, ctx) => {
      if (values.actor_id !== undefined && values.currency !== "SYP") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["currency"],
          message: t("validation.currencyMustBeSypWithActor"),
        });
      }
    });

export type AddTransactionSchema = z.input<
  ReturnType<typeof addTransactionSchema>
>;
