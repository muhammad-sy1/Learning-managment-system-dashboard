// import { title } from "process";
import z from "zod";
// const ALLOWED_ROLES = [
//   "CLIENT",
//   "DELIVERY",
//   "MERCHANT",
// ] as const;

export const editRoleUserSchema = (t: (key: string) => string) =>
  z.object({
    bio: z.string().max(200, {
      message: t("bio.tooLong"),
    }).min(50, {
      message: t("bio.tooShort"),
    }),
    title: z.string().max(200, {
      message: t("title.tooLong"),
    }),
    roles: z.array(z.string()).optional(),
  });

export type editRoleUserSchema = z.input<ReturnType<typeof editRoleUserSchema>>;
