import z from "zod";

export const registerSchema = (t: (key: string) => string) =>
    z.object({
        first_name: z
            .string()
            .min(2, {
                message: t("firstName.min"),
            })
            .max(50, {
                message: t("firstName.max"),
            }),
        last_name: z
            .string()
            .min(2, {
                message: t("lastName.min"),
            })
            .max(50, {
                message: t("lastName.max"),
            }),
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
        password_confirmation: z.string().min(8, {
            message: t("password.min"),
        }),
        phone_number: z
            .string()
            .optional()
            .refine(
                (val) => !val || /^(\+|00)[0-9\s]{10,}$/.test(val.replace(/\s/g, "")),
                {
                    message: t("phone.invalid"),
                }
            ),
    })
        .refine((data) => data.password === data.password_confirmation, {
            message: t("password.mismatch"),
            path: ["password_confirmation"],
        });

export type registerSchema = z.infer<ReturnType<typeof registerSchema>>;
