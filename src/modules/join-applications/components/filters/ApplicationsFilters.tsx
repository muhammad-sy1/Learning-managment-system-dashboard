"use client";

import { Form } from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import FormInput from "@/components/form-fields/FormInput";
import FormSelect from "@/components/form-fields/FormSelect";
import { Button } from "@/components/ui/button";
import useSearchForm from "@/hooks/useSearchForm";
import { ApplicationsFiltersSchema } from "../../schemas/applicationsFiltersSchemaFiltersSchema";

const defaultValues = {
  name: "",
  status: "",
  page: 1,
  search: "",
};

export default function ApplicationsFilters() {
  const t = useTranslations("Dashboard.filters");
  const applicationStatusT = useTranslations(
    "Dashboard.applicationsPage.statuses",
  );
  const form = useForm<ApplicationsFiltersSchema>({
    defaultValues,
  });
  useSearchForm<ApplicationsFiltersSchema>({
    form,
  });
  const conditionOptions = [
    { value: "submitted", label: applicationStatusT("submitted") },
    { value: "under_review", label: applicationStatusT("under_review") },
    { value: "approved", label: applicationStatusT("approved") },
    { value: "rejected", label: applicationStatusT("rejected") },
  ];
  return (
    <Form {...form}>
      <form className="flex flex-wrap gap-4 items-end">
        <FormInput<ApplicationsFiltersSchema>
          name="search"
          placeholder={t("fullNamePlaceholder")}
          label={t("fullName")}
          className=""
        />
        <FormSelect<ApplicationsFiltersSchema>
          name="status"
          control={form.control}
          options={conditionOptions}
          placeholder={t("status")}
          label={t("statusFilter")}
        />
        {/* <FormInfiniteCombobox<userFiltersSchema, IUser>
          name="user"
          queryKey={["users-filter"]}
          fetchFn={(page, search) => fetchUsersClient({
            page,
            full_name: search,
          })}
          getOptionLabel={(user) => user.full_name}
          getOptionValue={(user) => user.id}
          label={t("user")}
          placeholder={t("userPlaceholder")}
        /> */}
        {/* <FormInput<userFiltersSchema>
          name="email"
          placeholder={t("emailPlaceholder")}
          label={t("email")}
          className=""
        />
        <AccountFilters />
        <CountryFilters /> */}
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
