"use client";

import { Form } from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import FormInput from "@/components/form-fields/FormInput";
import FormSelect from "@/components/form-fields/FormSelect";
import { Button } from "@/components/ui/button";
import useSearchForm from "@/hooks/useSearchForm";
import { OrdersFiltersSchema } from "../../schemas/OrdersFiltersSchema";

const defaultValues = {
  name: "",
  status: "",
  types: "",
  page: 1,
};

export default function OrdersFilters() {
  const t = useTranslations("Dashboard.filters");
  const form = useForm<OrdersFiltersSchema>({
    defaultValues,
  });
  useSearchForm<OrdersFiltersSchema>({
    form,
  });
  const conditionOptions = [
    { value: "PROCESSING", label: t("processing") },
    { value: "DELEVIRING", label: t("dilivering") },
    { value: "COMPLETED", label: t("completed") },
    { value: "CANCELED", label: t("canceled") },
  ];
  return (
    <Form {...form}>
      <form className="flex flex-wrap gap-4 items-end">
        <FormInput<OrdersFiltersSchema>
          name="name"
          placeholder={t("fullNamePlaceholder")}
          label={t("fullName")}
          className=""
        />
        <FormSelect<OrdersFiltersSchema>
          name="status"
          control={form.control}
          options={conditionOptions}
          placeholder={t("status")}
          label={t("statusFilter")}
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
