"use client";

import { Form } from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import FormInput from "@/components/form-fields/FormInput";
import { Button } from "@/components/ui/button";
import useSearchForm from "@/hooks/useSearchForm";
import { CouponsFiltersSchema } from "../../schemas/CouponsFiltersSchema";

// القيم الافتراضية
const defaultValues = {
  code: "",
  page: 1,
};

export default function CouponsFilters() {
  const t = useTranslations("Dashboard.filters");
  const form = useForm<CouponsFiltersSchema>({
    defaultValues,
  });

  useSearchForm<CouponsFiltersSchema>({
    form,
  });

  return (
    <Form {...form}>
      <form className="flex flex-wrap gap-4 items-end">
        <FormInput<CouponsFiltersSchema>
          name="code"
          placeholder={t("codePlaceholder")}
          label={t("code")}
          className=""
        />

        {/* ممكن نضيف فلاتر تانية مثل النوع أو تاريخ الانتهاء */}
        {/* 
        <FormSelect<couponFiltersSchema>
          name="type"
          options={[
            { value: "PERCENTAGE", label: t("percentage") },
            { value: "FIXED", label: t("fixed") },
          ]}
          placeholder={t("typePlaceholder")}
          label={t("type")}
        />

        <FormDatePicker<couponFiltersSchema>
          name="expires_at"
          label={t("expiresAt")}
          placeholder={t("expiresAtPlaceholder")}
        />
        */}

        <Button
          type="reset"
          variant="outline"
          onClick={() => form.reset(defaultValues)}
        >
          {t("reset")}
        </Button>
      </form>
    </Form>
  );
}
