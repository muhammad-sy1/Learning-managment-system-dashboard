"use client";

import { Form } from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import FormInput from "@/components/form-fields/FormInput";
import FormSelect from "@/components/form-fields/FormSelect";
import { Button } from "@/components/ui/button";
import useSearchForm from "@/hooks/useSearchForm";
import { chatsFiltersSchema } from "../../schemas/chatsFiltersSchema";

const defaultValues = {
  name: "",
  search: "",
  status: "",
  page: 1,
};

export default function ChatsFilters() {
  const t = useTranslations("Dashboard.filters");
  const form = useForm<chatsFiltersSchema>({
    defaultValues,
  });
  useSearchForm<chatsFiltersSchema>({
    form,
  });
  const conditionOptions = [
    { value: "OPEN", label: t("open") },
    { value: "CLOSED", label: t("closed") },
    { value: "RATED", label: t("rated") },
  ];
  return (
    <Form {...form}>
      <form className="flex flex-wrap gap-4 items-end">
        <FormInput<chatsFiltersSchema>
          name="search"
          placeholder={t("fullNamePlaceholder")}
          label={t("fullName")}
          className=""
        />
        <FormSelect<chatsFiltersSchema>
          name="status"
          control={form.control}
          options={conditionOptions}
          placeholder={t("status")}
          label={t("statusChats")}
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
