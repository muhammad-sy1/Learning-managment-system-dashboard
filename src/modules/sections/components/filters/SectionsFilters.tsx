"use client";

import { Form } from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import FormInput from "@/components/form-fields/FormInput";
import { Button } from "@/components/ui/button";
import useSearchForm from "@/hooks/useSearchForm";
import { sectionFiltersSchema } from "../../types/section";

const defaultValues = {
  search: "",
  page: 1,
};

export default function SectionsFilters() {
  const t = useTranslations("Dashboard.filters");
  const form = useForm<sectionFiltersSchema>({
    defaultValues,
  });
  useSearchForm<sectionFiltersSchema>({
    form,
  });

  return (
    <Form {...form}>
      <form className="flex flex-wrap gap-4 items-end">
        <FormInput<sectionFiltersSchema>
          name="search"
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
