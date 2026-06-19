"use client";

import { Form } from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import FormSelect from "@/components/form-fields/FormSelect";
import { Button } from "@/components/ui/button";
import useSearchForm from "@/hooks/useSearchForm";
import { BannersFiltersSchema } from "../../schemas/bannersFiltersSchema";

const defaultValues = {
  type:undefined,
  page: 1,
};

export default function BannerFilters() {
  const t = useTranslations("Dashboard.filters");
  const form = useForm<BannersFiltersSchema>({
    defaultValues,
  });

  useSearchForm<BannersFiltersSchema>({
    form,
  });

  return (
    <Form {...form}>
      <form className="flex flex-wrap gap-4 items-end">
       

        <FormSelect<BannersFiltersSchema>
          name="type"
          control={form.control}
          options={[
            { value: "PERCENTAGE", label: t("percentage") },
            { value: "FIXED", label: t("fixed") },
          ]}
          placeholder={t("typePlaceholder")}
          label={t("type")}
        />

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
