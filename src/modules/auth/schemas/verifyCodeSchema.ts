import { z } from "zod";

export const verifyCodeSchema = (t: (key: string) => string) =>
  z.object({
    email: z.email({
      message: t("email"),
    }),
    code: z
      .string()
      .min(4, {
        message: t("otp.length"),
      })
      .refine((val) => /^\d+$/.test(val), {
        message: t("otp.type"),
      }),
  });

export type verifyCodeSchema = z.infer<ReturnType<typeof verifyCodeSchema>>;
