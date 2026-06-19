"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { profileSchema } from "../../schemas/profileSchema";
import FormPassword from "@/components/form-fields/FormPassword";
import Note from "./Note";
import Header from "../shared/Header";
import { Lock } from "lucide-react";

const ChangePasswordForm = () => {
  const form = useFormContext<profileSchema>();
  const t = useTranslations("Profile");

  return (
    <div className="mb-2">
      <Header Icon={<Lock />} title={t("changePassword")} />

      <fieldset className="grid gap-6 md:grid-cols-2">
        <FormPassword<profileSchema>
          control={form.control}
          name="current_password"
          label={t("currentPassword")}
        />
        <FormPassword<profileSchema>
          control={form.control}
          name="password"
          label={t("newPassword")}
        />
        <FormPassword<profileSchema>
          control={form.control}
          name="confirm_password"
          label={t("confirmPassword")}
        />
      </fieldset>

      <Note />
    </div>
  );
};

export default ChangePasswordForm;
