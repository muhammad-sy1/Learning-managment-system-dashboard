"use client";

import { Form } from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import FormInput from "@/components/form-fields/FormInput";
import { Button } from "@/components/ui/button";
import useSearchForm from "@/hooks/useSearchForm";
import { provinceFiltersSchema } from "../../schemas/provinceFiltersSchema";

const defaultValues = {
  name: "",
  page: 1,
};

export default function ProvinceFilters() {
  const t = useTranslations("Dashboard.filters");
  const form = useForm<provinceFiltersSchema>({
    defaultValues,
  });
  useSearchForm<provinceFiltersSchema>({
    form,
  });

  return (
    <Form {...form}>
      <form className="flex flex-wrap gap-4 items-end">
        <FormInput<provinceFiltersSchema>
          name="name"
          placeholder={t("fullNamePlaceholder")}
          label={t("fullName")}
          className=""
        />
      
        <Button
          type="reset"
          variant="outline"
          // onClick={() => form.reset(defaultValues)}
          onClick={() =>
            form.reset({
              ...defaultValues,
            })
          }
        >
          {t("reset")}
        </Button>
      </form>
    </Form>
  );
}
