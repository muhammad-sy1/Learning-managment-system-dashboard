// schemas/Transactions/editTransactionSchema.ts
import { positiveNumber } from "@/schemas";
import { z } from "zod";

export const editTransactionSchema = (t: (key: string) => string) =>
  z
    .object({
      description: z
        .string()
        .min(1, { message: t("validation.descriptionRequired") })
        .optional(),
      amount: z
        .string()
        .min(1, { message: t("validation.amountRequired") })
        .optional(),
      // type: z
      //   .enum(["+", "-"], {
      //     message: t("validation.typeRequired"),
      //   })
      //   .optional(),
      section_id: positiveNumber(
        t("validation.sectionIdRequired"),
        t("validation.sectionIdRequired"),
      ),
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

export type EditTransactionSchema = z.input<
  ReturnType<typeof editTransactionSchema>
>;
