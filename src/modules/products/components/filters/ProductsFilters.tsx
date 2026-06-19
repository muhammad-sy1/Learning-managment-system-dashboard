"use client";

import { Form } from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import FormInfiniteCombobox from "@/components/form-fields/FormInfiniteCombobox";
import FormInput from "@/components/form-fields/FormInput";
import FormInputWithRef from "@/components/form-fields/FormInputWithRef";
import { Button } from "@/components/ui/button";
import useSearchForm from "@/hooks/useSearchForm";
import { useFocusStore } from "@/modules/auth/store/useFocusStore";
import { SECTIONS_TABLE_QUERY_KEY } from "@/modules/sections";
import { fetchSectionsClient } from "@/modules/sections/services/sections";
import { ISection } from "@/modules/sections/types/section";
import { USERS_TABLE_QUERY_KEY } from "@/modules/users";
import { fetchUsersClient } from "@/modules/users/services/users";
import { IUser } from "@/modules/users/types/users";
import { useEffect, useRef } from "react";
import { ProductFiltersSchema } from "../../schemas/ProductFiltersSchema";
import { usePermissionStore } from "@/hooks/usePermissionStore";
import FormSelect from "@/components/form-fields/FormSelect";

const defaultValues = {
  search: "",
  section_id: undefined,
  page: 1,
  start_date: undefined,
  merchant_id: undefined,
  end_date: undefined,
  sort_by: undefined,
  status: undefined,
};

export default function ProductsFilters() {
  const t = useTranslations("Dashboard.filters");
  const form = useForm<ProductFiltersSchema>({
    defaultValues,
  });
  const { focusField, setFocusField } = useFocusStore();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const { hasPermission } = usePermissionStore();

  useEffect(() => {
    if (focusField === "search" && inputRef.current) {
      inputRef.current.focus();
      setFocusField(null);
    }
  }, [focusField, setFocusField]);

  useSearchForm<ProductFiltersSchema>({
    form,
  });

  return (
    <Form {...form}>
      <form className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
          <FormInputWithRef<ProductFiltersSchema>
            name="search"
            placeholder={t("fullNamePlaceholder")}
            label={t("fullName")}
            className="w-full"
            ref={inputRef}
          />
          {hasPermission("sections.view") && (
            <FormInfiniteCombobox<ProductFiltersSchema, ISection>
              name="section_id"
              queryKey={[SECTIONS_TABLE_QUERY_KEY]}
              fetchFn={(page, search) =>
                fetchSectionsClient({ page, search, type: "CATIGORIES" }).then(
                  (res) => ({
                    current_page: res.data.sections.current_page,
                    last_page: res.data.sections.last_page,
                    total: res.data.sections.total ?? 0,
                    data: res.data.sections.data,
                  }),
                )
              }
              getOptionLabel={(section) => section.name}
              getOptionValue={(section) => section.id}
              placeholder={t("section")}
              label={t("section")}
              className="w-full"
            />
          )}

          {hasPermission("merchants.view") && (
            <FormInfiniteCombobox<ProductFiltersSchema, IUser>
              name="merchant_id"
              queryKey={[USERS_TABLE_QUERY_KEY]}
              fetchFn={(page, search) =>
                fetchUsersClient(
                  {
                    page,
                    search,
                  },
                  "MERCHANT",
                )
              }
              getOptionLabel={(user) =>
                user.first_name + user.last_name + " - " + user.store_name
              }
              getOptionValue={(user) => user.id}
              label={t("merchnt")}
              placeholder={t("merchntPlaceholder")}
            />
          )}

          <FormInput<ProductFiltersSchema>
            type="date"
            name="start_date"
            placeholder={t("startDate")}
            label={t("startDate")}
            className="w-full"
          />

          <FormInput<ProductFiltersSchema>
            type="date"
            name="end_date"
            placeholder={t("endDate")}
            label={t("endDate")}
            className="w-full"
          />

          <FormInfiniteCombobox<
            ProductFiltersSchema,
            { value: string; label: string }
          >
            name="sort_by"
            queryKey={["products-sort"]}
            fetchFn={async () => ({
              current_page: 1,
              last_page: 1,
              total: 3,
              data: [
                { value: "best_selling", label: t("bestSelling") },
                { value: "least_selling", label: t("leastSelling") },
                { value: "newest", label: t("newest") },
              ],
            })}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            placeholder={t("sortBy")}
            className="w-full"
          />

          <FormInfiniteCombobox<
            ProductFiltersSchema,
            { value: string; label: string }
          >
            name="status"
            queryKey={["products-status"]}
            fetchFn={async () => ({
              current_page: 1,
              last_page: 1,
              total: 3,
              data: [
                { value: "PENDING", label: t("pending") },
                { value: "APPROVED", label: t("approval") },
                { value: "REJECTED", label: t("rejected") },
              ],
            })}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            placeholder={t("status")}
            label={t("status")}
            className="w-full"
          />
          <FormSelect<ProductFiltersSchema>
            control={form.control}
            name="is_final_reviewed"
            options={[
              { value: 1, label: t("yes") },
              { value: 0, label: t("no") },
            ]}
            placeholder={t("isFinalReviewed")}
            label={t("isFinalReviewed")}
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
