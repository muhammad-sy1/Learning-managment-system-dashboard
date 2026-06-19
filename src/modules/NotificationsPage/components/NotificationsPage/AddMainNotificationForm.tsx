"use client";

import FormCheckbox from "@/components/form-fields/FormCheckbox";
import FormInfiniteCombobox from "@/components/form-fields/FormInfiniteCombobox";
import FormInput from "@/components/form-fields/FormInput";
import FormInfiniteMultiCombobox from "@/components/form-fields/FormMultiSelectCombobox";
import { FormRadio } from "@/components/form-fields/FormRadio";
import FormTextarea from "@/components/form-fields/FormTextarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import { PRODUCTS_TABLE_QUERY_KEY } from "@/modules/products";
import { fetchProductsClient } from "@/modules/products/services/products";
import { IProduct } from "@/modules/products/types/products";
import { SECTIONS_TABLE_QUERY_KEY } from "@/modules/sections";
import { fetchSectionsClient } from "@/modules/sections/services/sections";
import {
  IGetSectionResponse,
  ISection,
} from "@/modules/sections/types/section";
import { USERS_LISTS_QUERY_KEY } from "@/modules/users";
import { fetchUsersClient } from "@/modules/users/services/users";
import { IUser } from "@/modules/users/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { BellRing, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useCreateNotification from "../../hooks/useCreateNotification";
import {
  AddNotificationFormValues,
  addNotificationSchema,
} from "../../schemas/addNotificationSchema";
import { ICreateNotification } from "../../types/notifications";

const defaultValues: AddNotificationFormValues = {
  title: "",
  body: "",
  click_action_type: "default",
  product_id: undefined,
  merchant_id: undefined,
  users_ids: undefined,
  global_for_client: 0,
  global_for_merchant: 0,
  global_for_delivery: 0,
  search: "",
  search_section_id: undefined,
  search_sub_section_id: undefined,
  search_merchant_id: undefined,
  custom_filters: "",
};

const USER_NOTIFICATION_ROLES = ["CLIENT", "MERCHANT", "DELIVERY"] as const;

interface IProps {
  onSuccess?: () => void;
}

function mapSectionsResponse(response: {
  data: IGetSectionResponse["data"];
}): IPaginatedResponse<ISection> {
  return {
    current_page: response.data.sections.current_page,
    data: response.data.sections.data,
    total: response.data.sections.total ?? 0,
    last_page: response.data.sections.last_page,
  };
}

function getUserLabel(user: IUser) {
  const name = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
  const role = user.roles?.find((item) =>
    USER_NOTIFICATION_ROLES.includes(
      item as (typeof USER_NOTIFICATION_ROLES)[number],
    ),
  );

  return [name, user.phone_number, role].filter(Boolean).join(" - ");
}

function buildWithFilters(values: AddNotificationFormValues) {
  const params = new URLSearchParams();
  const selectedSectionId =
    values.search_sub_section_id ?? values.search_section_id;

  if (selectedSectionId !== undefined) {
    params.set("section_id", String(selectedSectionId));
  }

  if (values.search?.trim()) {
    params.set("search", values.search.trim());
  }

  if (values.search_merchant_id !== undefined) {
    params.set("merchant_id", String(values.search_merchant_id));
  }

  const serializedParams = params.toString();
  const rawFilters = values.custom_filters?.trim().replace(/^[?&]+/, "");

  if (serializedParams && rawFilters) {
    return `${serializedParams}&${rawFilters}`;
  }

  return serializedParams || rawFilters || undefined;
}

export default function AddMainNotificationForm({ onSuccess }: IProps) {
  const { mutate, isPending } = useCreateNotification();
  const formT = useTranslations("Dashboard.NotificationsPage");

  const form = useForm<AddNotificationFormValues>({
    resolver: zodResolver(addNotificationSchema(formT)),
    defaultValues,
  });

  const clickActionType = form.watch("click_action_type");
  const selectedMainCategory = form.watch("search_section_id") as
    | number
    | undefined;
  const globalForClient = Number(form.watch("global_for_client") ?? 0);
  const globalForMerchant = Number(form.watch("global_for_merchant") ?? 0);
  const globalForDelivery = Number(form.watch("global_for_delivery") ?? 0);
  const hasBulkSelection =
    globalForClient === 1 || globalForMerchant === 1 || globalForDelivery === 1;

  useEffect(() => {
    form.setValue("search_sub_section_id", undefined, {
      shouldValidate: true,
    });
  }, [form, selectedMainCategory]);

  function onSubmit(values: AddNotificationFormValues) {
    const hasSelectedUsers =
      Array.isArray(values.users_ids) && values.users_ids.length > 0;
    const withFilters =
      values.click_action_type === "search_filters"
        ? buildWithFilters(values)
        : undefined;

    const payload: ICreateNotification = {
      title: values.title,
      body: values.body,
      ...(hasBulkSelection
        ? {
          ...(Number(values.global_for_client) === 1
            ? { global_for_client: 1 }
            : {}),
          ...(Number(values.global_for_merchant) === 1
            ? { global_for_merchant: 1 }
            : {}),
          ...(Number(values.global_for_delivery) === 1
            ? { global_for_delivery: 1 }
            : {}),
        }
        : hasSelectedUsers
          ? {
            users_ids: values.users_ids,
          }
          : {}),
      ...(values.click_action_type === "product" &&
        values.product_id !== undefined
        ? { product_id: Number(values.product_id) }
        : {}),
      ...(values.click_action_type === "merchant" &&
        values.merchant_id !== undefined
        ? { merchant_id: Number(values.merchant_id) }
        : {}),
      ...(values.click_action_type === "search_filters" && withFilters
        ? { with_filters: withFilters }
        : {}),
    };

    mutate(payload, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <fieldset disabled={isPending} className="space-y-6 px-1 py-4">
          <div className="space-y-5">
            <FormInput<AddNotificationFormValues>
              name="title"
              placeholder={formT("titleNotificationPlaceholder")}
              label={formT("titleNotification")}
              autoComplete="off"
              Icon={<BellRing className="size-4 text-muted-foreground" />}
            />
            <FormTextarea<AddNotificationFormValues>
              name="body"
              placeholder={formT("bodyPlaceholder")}
              label={formT("bodyLabel")}
              autoComplete="off"
            />

            <div className="space-y-4 rounded-xl border p-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">
                  {formT("bulkNotificationLabel")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {formT("bulkNotificationDescription")}
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <FormCheckbox
                  name="global_for_client"
                  label={formT("bulkClients")}
                />
                <FormCheckbox
                  name="global_for_merchant"
                  label={formT("bulkMerchants")}
                />
                <FormCheckbox
                  name="global_for_delivery"
                  label={formT("bulkDelivery")}
                />
              </div>

              {!hasBulkSelection && (
                <FormInfiniteMultiCombobox<AddNotificationFormValues, IUser>
                  name="users_ids"
                  queryKey={[USERS_LISTS_QUERY_KEY, "notifications-users"]}
                  fetchFn={async (pageNumber, search) => {
                    const result = await fetchUsersClient(
                      { page: pageNumber, search },
                      undefined,
                      USER_NOTIFICATION_ROLES.join(","),
                    );

                    return {
                      current_page: result.current_page || 1,
                      data: (result.data || []).filter((user) =>
                        user.roles?.some((role) =>
                          USER_NOTIFICATION_ROLES.includes(
                            role as (typeof USER_NOTIFICATION_ROLES)[number],
                          ),
                        ),
                      ),
                      total: result.total || 0,
                      last_page: result.last_page || 1,
                    };
                  }}
                  getOptionLabel={getUserLabel}
                  getOptionValue={(user) => user.id || ""}
                  label={formT("usersLabel")}
                  description={formT("usersDescription")}
                  disabled={isPending}
                />
              )}
            </div>

            <div className="space-y-4 rounded-xl border p-4">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">
                  {formT("notificationClickActionLabel")}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {formT("notificationClickActionDescription")}
                </p>
              </div>

              <FormRadio<AddNotificationFormValues>
                name="click_action_type"
                label={formT("clickActionTypeLabel")}
                options={[
                  {
                    label: formT("clickActionDefault"),
                    value: "default",
                  },
                  {
                    label: formT("clickActionProduct"),
                    value: "product",
                  },
                  {
                    label: formT("clickActionMerchant"),
                    value: "merchant",
                  },
                  {
                    label: formT("clickActionSearchFilters"),
                    value: "search_filters",
                  },
                ]}
              />

              {clickActionType === "product" && (
                <FormInfiniteCombobox<AddNotificationFormValues, IProduct>
                  name="product_id"
                  queryKey={[PRODUCTS_TABLE_QUERY_KEY, "notifications-product"]}
                  fetchFn={(pageNumber, search) =>
                    fetchProductsClient({ page: pageNumber, search })
                  }
                  getOptionLabel={(product) =>
                    `${product.id}# - ${product.name} - ${product.main_price || product.new_price
                    }`
                  }
                  getOptionValue={(product) => product.id || ""}
                  label={formT("productLabel")}
                  placeholder={formT("productPlaceholder")}
                  disabled={isPending}
                />
              )}

              {clickActionType === "merchant" && (
                <FormInfiniteCombobox<AddNotificationFormValues, IUser>
                  name="merchant_id"
                  queryKey={[USERS_LISTS_QUERY_KEY, "notifications-merchant"]}
                  fetchFn={async (pageNumber, search) => {
                    const result = await fetchUsersClient(
                      { page: pageNumber, search },
                      "MERCHANT",
                    );

                    return {
                      current_page: result.current_page || 1,
                      data: result.data || [],
                      total: result.total || 0,
                      last_page: result.last_page || 1,
                    };
                  }}
                  getOptionLabel={(merchant) =>
                    merchant.store_name ||
                    `${merchant.first_name ?? ""} ${merchant.last_name ?? ""}`.trim()
                  }
                  getOptionValue={(merchant) => merchant.id || ""}
                  label={formT("merchantLabel")}
                  placeholder={formT("merchantPlaceholder")}
                  disabled={isPending}
                />
              )}

              {clickActionType === "search_filters" && (
                <div className="grid gap-4 md:grid-cols-2">
                  <FormInput<AddNotificationFormValues>
                    name="search"
                    label={formT("searchFieldLabel")}
                    placeholder={formT("searchFieldPlaceholder")}
                    autoComplete="off"
                  />

                  <FormInfiniteCombobox<AddNotificationFormValues, ISection>
                    name="search_section_id"
                    queryKey={[
                      SECTIONS_TABLE_QUERY_KEY,
                      "notifications-main-sections",
                    ]}
                    fetchFn={(pageNumber, search) =>
                      fetchSectionsClient({
                        page: pageNumber,
                        search,
                        type: "CATIGORIES",
                      }).then(mapSectionsResponse)
                    }
                    getOptionLabel={(section) => section.name}
                    getOptionValue={(section) => section.id}
                    label={formT("mainCategoryLabel")}
                    placeholder={formT("mainCategoryPlaceholder")}
                    disabled={isPending}
                  />

                  {selectedMainCategory && (
                    <FormInfiniteCombobox<AddNotificationFormValues, ISection>
                      name="search_sub_section_id"
                      queryKey={[
                        SECTIONS_TABLE_QUERY_KEY,
                        "notifications-sub-sections",
                        String(selectedMainCategory),
                      ]}
                      fetchFn={(pageNumber, search) =>
                        fetchSectionsClient({
                          page: pageNumber,
                          search,
                          type: "SUB_CATIGORIES",
                          parent_id: String(selectedMainCategory),
                        }).then(mapSectionsResponse)
                      }
                      getOptionLabel={(section) => section.name}
                      getOptionValue={(section) => section.id}
                      label={formT("subCategoryLabel")}
                      placeholder={formT("subCategoryPlaceholder")}
                      disabled={isPending}
                    />
                  )}

                  <FormInfiniteCombobox<AddNotificationFormValues, IUser>
                    name="search_merchant_id"
                    queryKey={[
                      USERS_LISTS_QUERY_KEY,
                      "notifications-search-merchant",
                    ]}
                    fetchFn={async (pageNumber, search) => {
                      const result = await fetchUsersClient(
                        { page: pageNumber, search },
                        "MERCHANT",
                      );

                      return {
                        current_page: result.current_page || 1,
                        data: result.data || [],
                        total: result.total || 0,
                        last_page: result.last_page || 1,
                      };
                    }}
                    getOptionLabel={(merchant) =>
                      merchant.store_name ||
                      `${merchant.first_name ?? ""} ${merchant.last_name ?? ""
                        }`.trim()
                    }
                    getOptionValue={(merchant) => merchant.id || ""}
                    label={formT("searchMerchantLabel")}
                    placeholder={formT("searchMerchantPlaceholder")}
                    disabled={isPending}
                  />

                  <div className="md:col-span-2">
                    <FormInput<AddNotificationFormValues>
                      name="custom_filters"
                      label={formT("customParamsLabel")}
                      placeholder={formT("customParamsPlaceholder")}
                      autoComplete="off"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isPending}
              className="h-12 w-full bg-primary font-semibold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] hover:bg-primary/90 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <Spinner className="h-4 w-4" />
                  <span>{formT("creatingButton")}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>{formT("createButton")}</span>
                </div>
              )}
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
