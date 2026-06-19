import { isValidPhoneNumber } from "react-phone-number-input";
import z from "zod";

export const profileSchema = (t: (key: string) => string) => {
  const passwordField = z
    .string()
    .trim()
    .min(8, { message: t("password.min") })
    .max(50, { message: t("password.max") })
    .regex(/^(?!\s*$).+/, { message: t("password.invalid") });

  return z
    .object({
      first_name: z
        .string()
        .min(2, { message: t("full_name.min") })
        .max(100, { message: t("full_name.max") })
        .regex(/^[a-zA-Z0-9_]+$/, { message: t("full_name.invalid") })
        .optional(),
      last_name: z
        .string()
        .min(2, { message: t("full_name.min") })
        .max(100, { message: t("full_name.max") })
        .regex(/^[a-zA-Z0-9_]+$/, { message: t("full_name.invalid") })
        .optional(),

      email: z.email({ message: t("email") }).optional(),

      phone_number: z
        .string()
        .refine((val) => val === "" || isValidPhoneNumber(val), {
          message: t("phone.invalid"),
        }).optional(),

      current_password: z.string().optional(),
      password: z.string().optional(),
      confirm_password: z.string().optional(),

      image: z
        .union([z.instanceof(File), z.string(), z.null(), z.undefined()])
        .refine(
          (value) => {
            if (!value || typeof value === "string") return true;
            return value.size <= 5 * 1024 * 1024;
          },
          { message: t("image.fileSizeLimit") }
        )
        .refine(
          (value) => {
            if (!value || typeof value === "string") return true;
            return ["image/jpeg", "image/png", "image/jpg"].includes(
              value.type
            );
          },
          { message: t("image.fileTypeInvalid") }
        )
        .optional(),
    })
    .refine(
      (data) => {
        const wantsPasswordChange =
          data.current_password || data.password || data.confirm_password;

        if (wantsPasswordChange) {
          return (
            !!data.current_password &&
            !!data.password &&
            !!data.confirm_password
          );
        }
        return true;
      },
      {
        message: t("password.requiredAll"),
        path: ["password"],
      }
    )
    .refine(
      (data) => {
        if (data.password && data.confirm_password) {
          return data.password === data.confirm_password;
        }
        return true;
      },
      {
        message: t("confirmPassword.match"),
        path: ["confirm_password"],
      }
    )
    .superRefine((data, ctx) => {
      // validate password strength only when password is provided
      if (data.password) {
        const result = passwordField.safeParse(data.password);
        if (!result.success) {
          result.error.issues.forEach((issue) => {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: issue.message,
              path: ["password"],
            });
          });
        }
      }
    });
};

export type profileSchema = z.infer<ReturnType<typeof profileSchema>>;
