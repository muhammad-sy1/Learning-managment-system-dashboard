import { z } from "zod";

export const forgotPasswordSchema = (t: (key: string) => string) =>
  z.object({
    email: z.email({
      message: t("email"),
    }),
    type: z.enum(["reset", "registration"], {
      message: t("type"),
    }),
  });

export type forgotPasswordSchema = z.infer<
  ReturnType<typeof forgotPasswordSchema>
>;
