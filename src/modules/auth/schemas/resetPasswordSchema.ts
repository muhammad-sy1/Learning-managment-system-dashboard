import z from "zod";

export const resetPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      password: z
        .string()
        .min(8, {
          message: t("password.min"),
        })
        .max(50, {
          message: t("password.max"),
        }),
      password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
      message: t("confirmPassword.match"),
      path: ["password_confirmation"],
    });

export type resetPasswordSchema = z.infer<
  ReturnType<typeof resetPasswordSchema>
>;
