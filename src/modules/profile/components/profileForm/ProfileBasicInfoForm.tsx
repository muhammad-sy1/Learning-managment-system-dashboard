"use client";

import FormInput from "@/components/form-fields/FormInput";
import { User, Mail } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { profileSchema } from "../../schemas/profileSchema";
import Header from "../shared/Header";
import FormPhoneInput from "@/components/form-fields/FormPhoneInput";

const ProfileBasicInfoForm = () => {
  const form = useFormContext<profileSchema>();
  const t = useTranslations("Profile");

  return (
    <div className="mb-8">
      {/* Section Header */}
      <Header Icon={<User />} title={t("profileInformation")} />

      {/* Form Fields */}
      <fieldset className="grid gap-6 md:grid-cols-2">
        <FormInput<profileSchema>
          control={form.control}
          name="first_name"
          Icon={<User className="w-5 h-5 text-muted-foreground" />}
          label={t("fullName")}
          type="text"
          placeholder={t("fullNamePlaceholder")}
        />
        <FormInput<profileSchema>
          control={form.control}
          name="last_name"
          Icon={<User className="w-5 h-5 text-muted-foreground" />}
          label={t("fullName")}
          type="text"
          placeholder={t("fullNamePlaceholder")}
        />
        <FormInput<profileSchema>
          control={form.control}
          name="email"
          Icon={<Mail className="w-5 h-5 text-muted-foreground" />}
          label={t("email")}
          type="email"
          placeholder={t("emailPlaceholder")}
          disabled={true}
        />
        <FormPhoneInput<profileSchema>
          control={form.control}
          name="phone_number"
          label={t("phone")}
          description={t("phoneDescription")}
        />
      </fieldset>
    </div>
  );
};
export default ProfileBasicInfoForm;
