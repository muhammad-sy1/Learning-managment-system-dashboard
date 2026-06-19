"use client";

import Loading from "@/app/[locale]/dashboard/loading";
import FormCheckbox from "@/components/form-fields/FormCheckbox";
import FormInput from "@/components/form-fields/FormInput";
import FormInfiniteMultiCombobox from "@/components/form-fields/FormMultiSelectCombobox";
import { FormRadio } from "@/components/form-fields/FormRadio";
import FormSelect from "@/components/form-fields/FormSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import { getDirtyValues } from "@/lib/utils";
import { fetchProductsClient } from "@/modules/products/services/products";
import { IProduct } from "@/modules/products/types/products";
import { fetchUsersClient } from "@/modules/users/services/users";
import { IUser } from "@/modules/users/types/users";
import { formatForDateTimeLocal } from "@/utils/formatDate";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Banknote,
  Calendar,
  DollarSign,
  FileText,
  Hash,
  Plus,
  Tag,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useGetCouponById } from "../../hooks/useGetCouponById";
import useUpdateCoupon from "../../hooks/useUpdateCoupon";
import {
  editCouponSchema,
  EditCouponSchema,
} from "../../schemas/editCouponSchema";

interface IEditCouponFormProps {
  couponId: number;
  onSuccess?: () => void;
}

function prepareInitialValues(data: any): EditCouponSchema {
  const coupon = data?.coupon || data;
  return {
    code: coupon.code || "",
    usage_limit:
      coupon.usage_limit !== undefined ? Number(coupon.usage_limit) : null,
    type: coupon.type || "PERCENTAGE",
    value: coupon.value !== undefined ? Number(coupon.value) : 0,
    expires_at: coupon.expires_at
      ? formatForDateTimeLocal(coupon.expires_at)
      : "",
    is_global_for_users: coupon.is_global_for_users || 0,
    is_global_for_products: coupon.is_global_for_products || 0,
    is_company_sponsored: coupon.is_company_sponsored || 0,
    user_ids: coupon.users?.map((user: any) => user.id) || [],
    description: coupon.description || "",
    applies_to: coupon.applies_to || "",
    // name: coupon.name || "",
    min_order_amount: coupon.min_order_amount || 0,
    product_ids: coupon.products?.map((product: any) => product.id) || [],
    merchant_ids: coupon.merchants?.map((merchant: any) => merchant.id) || [],
  };
}

export default function EditCouponForm({
  couponId,
  onSuccess,
}: IEditCouponFormProps) {
  const { mutate, isPending } = useUpdateCoupon();
  const { data, isFetching } = useGetCouponById(couponId);
  const formT = useTranslations("Dashboard.CouponsPage.fields");
  const formAc = useTranslations("Dashboard.CouponsPage.actions");
  const formV = useTranslations("Dashboard.CouponsPage.validation");
  const [productOptions, setProductOptions] = useState<any>([]);

  const form = useForm<EditCouponSchema>({
    resolver: zodResolver(editCouponSchema(formV)),
    mode: "onChange",
    defaultValues: {
      code: "",
      usage_limit: null,
      type: "PERCENTAGE",
      value: 0,
      expires_at: "",
      is_global_for_users: 0,
      // name: "",
      is_company_sponsored: 0,
      is_global_for_products: 0,
      user_ids: [],
      product_ids: [],
      merchant_ids: [],
    },
  });
  const type = form.watch("type");

  const appliesTo = form.watch("applies_to");

  const couponType = form.watch("type");
  const isGlobalForUsers = form.watch("is_global_for_users");
  const isGlobalForProducts = form.watch("is_global_for_products");

  useEffect(() => {
    if (isGlobalForUsers === 1) {
      form.setValue("user_ids", [], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    if (isGlobalForProducts == 1) {
      form.setValue("product_ids", [], {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [isGlobalForUsers, form, isGlobalForProducts]);

  function onSubmit(values: EditCouponSchema) {
    const dirtyValues =
      getDirtyValues(form.formState.dirtyFields, values) ?? {};

    const processedData: Partial<EditCouponSchema> = {
      ...dirtyValues,
      usage_limit:
        dirtyValues.usage_limit !== undefined
          ? Number(dirtyValues.usage_limit)
          : undefined,
      applies_to: values.applies_to,
      value:
        dirtyValues.value !== undefined ? Number(dirtyValues.value) : undefined,
    };

    if (values.applies_to !== "CUSTOM_ORDER_SHIPPING") {
      processedData.min_order_amount = values.min_order_amount;
    }
    // for CUSTOM_ORDER_SHIPPING, min_order_amount is intentionally omitted

    mutate(
      { id: couponId, couponData: processedData },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  }

  const AppliesToOptions = [
    {
      label: formT("appliesTo.products"),
      value: "PRODUCTS",
    },
    {
      label: formT("appliesTo.shipping"),
      value: "SHIPPING",
    },
    {
      label: formT("appliesTo.CUSTOM_ORDER_SHIPPING"),
      value: "CUSTOM_ORDER_SHIPPING",
    },
  ];

  useEffect(() => {
    if (data) {
      const initialValues = prepareInitialValues(data);
      form.reset(initialValues);

      const productsFromCoupon = data.products || [];
      setProductOptions(productsFromCoupon);
    }
  }, [data, form]);

  const TypesOptions = [
    { label: formT("percentage"), value: "PERCENTAGE" },
    { label: formT("fixed"), value: "FIXED" },
  ];

  if (isFetching) {
    return <Loading customHeight="h-96" />;
  }

  return (
    <div className="">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.error("Form validation failed:", errors);
          })}
          className="space-y-6"
        >
          <fieldset disabled={isPending} className="space-y-6 py-4">
            <div className="space-y-5">
              <FormSelect<EditCouponSchema>
                control={form.control}
                name="applies_to"
                label={formT("appliesTo.label")}
                options={AppliesToOptions}
                placeholder={formT("appliesTo.placeholder")}
                // Icon={<ShoppingCart className="size-4 text-muted-foreground" />}
              />

              <FormInput<EditCouponSchema>
                name="code"
                placeholder={formT("codePlaceholder")}
                label={formT("code")}
                autoComplete="off"
                Icon={<Hash className="size-4 text-muted-foreground" />}
              />

              <FormInput<EditCouponSchema>
                name="description"
                type="textarea"
                placeholder={formT("descriptionPlaceholder")}
                label={formT("description")}
                // rows={3}
                Icon={<FileText className="size-4 text-muted-foreground" />}
              />
              <FormInput<EditCouponSchema>
                name="usage_limit"
                type="number"
                placeholder={formT("usageLimitPlaceholder")}
                label={formT("usageLimit")}
                autoComplete="off"
                Icon={<Tag className="size-4 text-muted-foreground" />}
              />

              <FormRadio<EditCouponSchema>
                name="type"
                label={formT("discountType")}
                options={TypesOptions}
              />

              <FormInput<EditCouponSchema>
                name="value"
                type="number"
                step="0.01"
                placeholder={
                  couponType === "PERCENTAGE"
                    ? formT("percentagePlaceholder")
                    : formT("valuePlaceholder")
                }
                label={formT("value")}
                autoComplete="off"
                Icon={
                  couponType === "PERCENTAGE" ? (
                    <span className="text-muted-foreground">%</span>
                  ) : (
                    <Banknote className="size-4 text-muted-foreground" />
                  )
                }
              />

              <FormInput<EditCouponSchema>
                name="expires_at"
                type="datetime-local"
                placeholder={formT("expiresAtPlaceholder")}
                label={formT("expiresAt")}
                autoComplete="off"
                Icon={<Calendar className="size-4 text-muted-foreground" />}
              />

              <div className="space-y-4 border rounded-lg p-[9px]">
                <h3 className="font-medium">{formT("usersSection")}</h3>

                <FormCheckbox
                  name="is_global_for_users"
                  label={formT("globalForUsers")}
                  description={formT("globalForUsersDescription")}
                />

                {isGlobalForUsers == 0 && (
                  <FormInfiniteMultiCombobox<EditCouponSchema, IUser>
                    name="user_ids"
                    queryKey={["users"]}
                    fetchFn={async (pageNumber: number, search: string) => {
                      const result = await fetchUsersClient(
                        {
                          page: pageNumber,
                          search: search,
                        },
                        "CLIENT",
                      );

                      return {
                        current_page: result.current_page || 1,
                        data: result.data || [],
                        total: result.total || 0,
                        last_page: result.last_page || 1,
                      };
                    }}
                    getOptionLabel={(c) => {
                      const ltrMark = "\u202A";
                      const popMark = "\u202C";

                      return `${
                        c.first_name ? c.first_name + "-" : ""
                      } ${ltrMark}${c.phone_number ?? ""}${popMark}`;
                    }}
                    getOptionValue={(c) => c.id || ""}
                    label={formT("selectUsers")}
                    disabled={isPending}
                  />
                )}
              </div>

              {form.watch("applies_to") !== "CUSTOM_ORDER_SHIPPING" && (
                <>
                  <FormInput<EditCouponSchema>
                    name="min_order_amount"
                    type="number"
                    step="0.01"
                    placeholder={formT("minOrderAmountPlaceholder")}
                    label={formT("minOrderAmount")}
                    autoComplete="off"
                    Icon={
                      <DollarSign className="size-4 text-muted-foreground" />
                    }
                  />
                  <div className="space-y-4 border  rounded-lg p-[9px]">
                    <h3 className="font-medium">{formT("productsSection")}</h3>

                    <FormCheckbox
                      name="is_global_for_products"
                      label={formT("globalForProducts")}
                      description={formT("globalForProductsDescription")}
                    />

                    {form.watch("type") == "PERCENTAGE" &&
                    form.watch("applies_to") == "SHIPPING" ? (
                      <></>
                    ) : (
                      isGlobalForProducts == 0 && (
                        <FormInfiniteMultiCombobox<EditCouponSchema, IProduct>
                          name="product_ids"
                          label={formT("selectProducts")}
                          queryKey={["products"]}
                          initialOptions={productOptions}
                          fetchFn={async (pageNumber, search) => {
                            const result = await fetchProductsClient({
                              search,
                              page: pageNumber,
                            });

                            return {
                              current_page: result.current_page,
                              data: result.data,
                              total: result.total,
                              last_page: result.last_page,
                            };
                          }}
                          getOptionLabel={(product) =>
                            `${product.name} - ${
                              product.main_price ?? product.new_price ?? ""
                            }`
                          }
                          getOptionValue={(product) => product.id}
                        />
                      )
                    )}
                  </div>
                </>
              )}

              {isGlobalForProducts === 0 &&
                !(type === "PERCENTAGE" && appliesTo === "SHIPPING") && (
                  <div className="space-y-4 px-2 border rounded-lg p-[9px]">
                    <h3 className="font-medium">{formT("merchantsSection")}</h3>

                    <FormInfiniteMultiCombobox<EditCouponSchema, IUser>
                      name="merchant_ids"
                      queryKey={["merchants"]}
                      fetchFn={async (pageNumber: number, search: string) => {
                        const result = await fetchUsersClient(
                          {
                            page: pageNumber,
                            search: search,
                          },
                          "MERCHANT",
                        );

                        return {
                          current_page: result.current_page || 1,
                          data: result.data || [],
                          total: result.total || 0,
                          last_page: result.last_page || 1,
                        };
                      }}
                      getOptionLabel={(c) => c.first_name + " " + c.last_name}
                      getOptionValue={(c) => c.id || ""}
                      label={formT("selectMerchants")}
                      disabled={isPending}
                    />
                  </div>
                )}

              {form.watch("applies_to") === "PRODUCTS" && (
                <>
                  <FormCheckbox
                    name="is_company_sponsored"
                    label={formT("is_company_sponsored")}
                  />
                </>
              )}
            </div>

            <div className="pt-4 px-4">
              <Button
                type="submit"
                disabled={isPending || !form.formState.isDirty}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isPending ? (
                  <div className="flex items-center space-x-2">
                    <Spinner className="w-4 h-4" />
                    <span>{formAc("update")}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>{formAc("update")}</span>
                  </div>
                )}
              </Button>
            </div>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}
