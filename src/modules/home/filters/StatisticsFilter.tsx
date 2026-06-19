"use client";

import { Form } from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import FormInput from "@/components/form-fields/FormInput";
import FormSelect from "@/components/form-fields/FormSelect";
import { Button } from "@/components/ui/button";
import useSearchForm from "@/hooks/useSearchForm";
import { StatisticsFiltersSchema } from "../schemas/StatisticsFiltersSchema";

const defaultValues = {
  page: 1,
  start_date: undefined,
  end_date: undefined,
  rang: undefined,
};

export default function StatisticsFilter() {
  const t = useTranslations("Dashboard.filters");
  const form = useForm<StatisticsFiltersSchema>({
    defaultValues,
  });

  useSearchForm<StatisticsFiltersSchema>({
    form,
  });

  const conditionOptions = [
    { value: "day", label: t("day") },
    { value: "month", label: t("month") },
    { value: "week", label: t("week") },
    { value: "year", label: t("year") },
  ];
  return (
    <Form {...form}>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <FormInput<StatisticsFiltersSchema>
            type="date"
            name="start_date"
            placeholder={t("startDate")}
            label={t("startDate")}
            className="w-full"
          />

          <FormInput<StatisticsFiltersSchema>
            type="date"
            name="end_date"
            placeholder={t("endDate")}
            label={t("endDate")}
            className="w-full"
          />
          <FormSelect<StatisticsFiltersSchema>
            name="range"
            control={form.control}
            options={conditionOptions}
            placeholder={t("range")}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="reset"
            variant="outline"
            onClick={() => form.reset(defaultValues)}
          >
            {t("reset")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
