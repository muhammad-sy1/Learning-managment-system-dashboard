"use client";

import { Form } from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import FormInput from "@/components/form-fields/FormInput";
import { Button } from "@/components/ui/button";
import useSearchForm from "@/hooks/useSearchForm";
import { UserFiltersSchema } from "../../schemas/userFiltersSchema";

const defaultValues = {
  first_name: "",
  email: "",
  search: "",

  page: 1,
  role: "CLIENT",
  user: "",
};

export default function UsersFilters() {
  const t = useTranslations("Dashboard.filters");
  const form = useForm<UserFiltersSchema>({
    defaultValues,
  });
  useSearchForm<UserFiltersSchema>({
    form,
  });

  return (
    <Form {...form}>
      <form className="flex flex-wrap gap-4 items-end">
        <FormInput<UserFiltersSchema>
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
              role: form.getValues("role"),
            })
          }
        >
          {t("reset")}
        </Button>
      </form>
    </Form>
  );
}
