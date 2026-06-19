import z from "zod";
const ALLOWED_ROLES = [
  "CLIENT",
  "DELIVERY",
  "MERCHANT",
] as const;

export const editRoleUserSchema = (t: (key: string) => string) =>
  z.object({
    roles: z
      .array(
        z
          .string()
          .refine((val) => ALLOWED_ROLES.includes(val as any), {
            message: t("roles.invalid"),
          })
      )
      .min(1, {
        message: t("roles.required"),
      }),
  });

export type editRoleUserSchema = z.input<ReturnType<typeof editRoleUserSchema>>;
