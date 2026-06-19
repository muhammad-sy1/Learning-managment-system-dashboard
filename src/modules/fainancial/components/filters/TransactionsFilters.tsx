"use client";

import { Form } from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import FormInfiniteCombobox from "@/components/form-fields/FormInfiniteCombobox";
import FormInput from "@/components/form-fields/FormInput";
import { Button } from "@/components/ui/button";
import useSearchForm from "@/hooks/useSearchForm";
import { fetchSectionsClient } from "@/modules/sections/services/sections";
import { ISection } from "@/modules/sections/types/section";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  FAINANCIAL_TABLE_QUERY_KEY,
  SUB_FAINANCIAL_TABLE_QUERY_KEY,
} from "../..";
import { TransactionFilters } from "../../types/transaction";
import { usePermissionStore } from "@/hooks/usePermissionStore";

const defaultValues = {
  section_id: undefined,
  sub_section_id: undefined,
  end_date: "",
  start_date: "",
  page: 1,
};

export default function TransactionsFilters() {
  const t = useTranslations("Dashboard.filters");
  const { hasPermission } = usePermissionStore();

  const form = useForm<TransactionFilters>({
    defaultValues,
  });
  useSearchForm<TransactionFilters>({
    form,
  });
  const searchParams = useSearchParams();
  const main_section_Form_url = searchParams.get("section_id") ?? "";
  const watchedSectionId = form.watch("section_id") ?? "";

  useEffect(() => {
    if (watchedSectionId) {
      form.setValue("sub_section_id", undefined);
    }
  }, [watchedSectionId, form]);
  return (
    <Form {...form}>
      <form className="flex flex-wrap gap-4  items-end">
        <FormInput<TransactionFilters>
          name="start_date"
          type="date"
          placeholder={t("startDate")}
          label={t("startDate")}
          className=""
        />
        <FormInput<TransactionFilters>
          name="end_date"
          type="date"
          placeholder={t("endDate")}
          label={t("endDate")}
          className=""
        />
        <div className="">
          {hasPermission("finance.view") && (
            <FormInfiniteCombobox<TransactionFilters, ISection>
              name="section_id"
              queryKey={[FAINANCIAL_TABLE_QUERY_KEY]}
              fetchFn={(page, search) =>
                fetchSectionsClient({
                  page,
                  type: "FINANCIAL_MAIN_SECTIONS",
                  search,
                }).then((res) => ({
                  current_page: res.data.sections.current_page,
                  last_page: res.data.sections.last_page,
                  total: res.data.sections.total ?? 0,
                  data: res.data.sections.data,
                }))
              }
              getOptionLabel={(section) => section.name}
              getOptionValue={(section) => section?.id}
              placeholder={t("section")}
              className="w-full"
            />
          )}
        </div>
        <div className="">
          {hasPermission("sub-finance.view") && (
            <FormInfiniteCombobox<TransactionFilters, ISection>
              name="sub_section_id"
              queryKey={[SUB_FAINANCIAL_TABLE_QUERY_KEY, watchedSectionId]}
              fetchFn={(page, search) =>
                fetchSectionsClient({
                  page,
                  type: "FINANCIAL_SUB_SECTIONS",
                  search,
                  parent_id: watchedSectionId || undefined,
                }).then((res) => ({
                  current_page: res.data.sections.current_page,
                  last_page: res.data.sections.last_page,
                  total: res.data.sections.total ?? 0,
                  data: res.data.sections.data,
                }))
              }
              getOptionLabel={(section) => section.name}
              getOptionValue={(section) => section.id}
              placeholder={t("sub_section")}
              className="w-full"
            />
          )}
        </div>

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
