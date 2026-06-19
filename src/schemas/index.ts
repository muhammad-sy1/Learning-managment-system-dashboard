// import { z } from "zod";

import z from "zod";

// export const forgotPasswordSchema = (t: (key: string) => string) =>
//   z.object({
//     email: z.email({
//       message: t("email"),
//     }),
//     type: z.enum(["reset", "registration"], {
//       message: t("type"),
//     }),
//   });

// export type forgotPasswordSchema = z.infer<
//   ReturnType<typeof forgotPasswordSchema>
// >;

export const positiveNumber = (
  requiredMessage: string,
  invalidMessage: string,
  allowComma: boolean = false,
  max?: number

) =>
  z.preprocess(
    (val) => {
      if (val === "" || val === undefined || val === null) return undefined;

      if (typeof val === "string") {
        let value = val.trim();

        if (allowComma) {
          value = value.replace(",", ".");
        }

        const parsed = Number(value);
        return isNaN(parsed) ? undefined : parsed;
      }

      return val;
    },
    z
      .number({ message: requiredMessage })
      .refine((val) => val >= 0, { message: invalidMessage })
      .refine(
        (val) => (max !== undefined ? val <= max : true),
        { message: invalidMessage }
      ),
  );

export const positiveNumberOptional = (invalidMessage: string) =>
  z
    .preprocess(
      (val) => {
        if (val === "" || val === undefined || val === null) {
          return undefined;
        }
        return Number(val);
      },
      z.number().refine((val) => val >= 0, { message: invalidMessage }),
    )
    .optional();

interface ImageSchemaOptions {
  t?: (key: string) => string;
}

export const imageSchema = ({ t }: ImageSchemaOptions = {}) =>
  z
    .union([z.instanceof(File), z.null(), z.undefined()])
    .refine(
      (value) => {
        if (!value) return true;
        return value.size <= 5 * 1024 * 1024;
      },
      {
        message: t?.("image.fileSizeLimit") || "File size must not exceed 5MB",
      },
    )
    .refine(
      (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
      },
      {
        message:
          t?.("image.fileTypeInvalid") || "Invalid file type (jpg, jpeg, png)",
      },
    );
//z.instanceof(File), z.string(), z.null(), z.undefined()

export const imageSchemaOptional = ({ t }: ImageSchemaOptions = {}) =>
  z
    .union([z.instanceof(File), z.string(), z.null(), z.undefined()])
    .refine(
      (value) => {
        if (!value) return true;
        if (value instanceof File) return value.size <= 5 * 1024 * 1024;
        return true;
      },
      {
        message: t?.("image.fileSizeLimit") || "File size must not exceed 5MB",
      },
    )
    .refine(
      (value) => {
        if (!value) return true;
        if (value instanceof File) {
          return ["image/jpeg", "image/png", "image/jpg"].includes(value.type);
        }
        return true;
      },
      {
        message:
          t?.("image.fileTypeInvalid") || "Invalid file type (jpg, jpeg, png)",
      },
    )
    .optional();
