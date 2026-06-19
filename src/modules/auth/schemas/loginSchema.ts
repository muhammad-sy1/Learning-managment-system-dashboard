import z from "zod";

export const loginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.email({
      message: t("email"),
    }),
    password: z
      .string()
      .min(8, {
        message: t("password.min"),
      })
      .max(50, {
        message: t("password.max"),
      }),
  });

export type loginSchema = z.infer<ReturnType<typeof loginSchema>>;
