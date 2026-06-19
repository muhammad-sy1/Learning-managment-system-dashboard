"use client";

import FormInfiniteCombobox from "@/components/form-fields/FormInfiniteCombobox";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useSearchForm from "@/hooks/useSearchForm";
import { USERS_TABLE_QUERY_KEY } from "@/modules/users";
import { fetchUsersClient } from "@/modules/users/services/users";
import { IUser } from "@/modules/users/types/users";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { UsersCartsFilters as UsersCartsFiltersValues } from "../types/usersCarts";

const defaultValues: UsersCartsFiltersValues = {
  page: 1,
  merchant_id: undefined,
  user_id: undefined,
};

function getUserLabel(user: IUser) {
  return [
    [user.first_name, user.last_name].filter(Boolean).join(" "),
    user.store_name,
    user.phone_number,
  ]
    .filter(Boolean)
    .join(" - ");
}

export default function UsersCartsFilters() {
  const t = useTranslations("Dashboard.UsersCartsPage.filters");
  const tDashboardFilters = useTranslations("Dashboard.filters");
  const form = useForm<UsersCartsFiltersValues>({
    defaultValues,
  });

  useSearchForm<UsersCartsFiltersValues>({ form });

  return (
    <Form {...form}>
      <form className="rounded-lg border border-border/50 bg-card p-4 shadow-sm">
        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-3">
          <FormInfiniteCombobox<UsersCartsFiltersValues, IUser>
            name="user_id"
            queryKey={[USERS_TABLE_QUERY_KEY, "users-carts-clients"]}
            fetchFn={(page, search) =>
              fetchUsersClient(
                {
                  page,
                  search,
                },
                "CLIENT",
              )
            }
            getOptionLabel={getUserLabel}
            getOptionValue={(user) => user.id}
            label={t("user")}
            placeholder={t("userPlaceholder")}
          />

          <FormInfiniteCombobox<UsersCartsFiltersValues, IUser>
            name="merchant_id"
            queryKey={[USERS_TABLE_QUERY_KEY, "users-carts-merchants"]}
            fetchFn={(page, search) =>
              fetchUsersClient(
                {
                  page,
                  search,
                },
                "MERCHANT",
              )
            }
            getOptionLabel={getUserLabel}
            getOptionValue={(user) => user.id}
            label={t("merchant")}
            placeholder={t("merchantPlaceholder")}
          />

          <div className="flex justify-end">
            <Button
              type="reset"
              variant="outline"
              onClick={() => form.reset(defaultValues)}
            >
              {tDashboardFilters("reset")}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
