"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Banknote,
  Calendar,
  DollarSign,
  FileText,
  Hash,
  Package,
  Plus,
  Tag,
  Truck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useCreateCoupon from "../../hooks/useCreateCoupon";
import {
  AddCouponSchema,
  addCouponSchema,
} from "../../schemas/addCouponSchema";
import { CreateCouponPayload } from "../../types/coupons";

interface IProps {
  onSuccess?: () => void;
}

const defaultValues: AddCouponSchema = {
  code: "",
  usage_limit: null,
  type: "PERCENTAGE",
  // name: "",
  value: undefined,
  expires_at: "",
  is_global_for_users: 0,
  is_company_sponsored: 0,
  is_global_for_products: 0,
  user_ids: undefined,
  product_ids: undefined,
  merchant_ids: undefined,
  applies_to: "PRODUCTS",
  description: "",
  min_order_amount: undefined,
};

export default function AddCouponForm({ onSuccess }: IProps) {
  const { mutate, isPending } = useCreateCoupon();
  const formT = useTranslations("Dashboard.CouponsPage.fields");
  const formAc = useTranslations("Dashboard.CouponsPage.actions");
  const formV = useTranslations("Dashboard.CouponsPage.validation");

  const [selectedProducts, setSelectedProducts] = useState<IProduct[]>([]);

  const form = useForm<AddCouponSchema>({
    resolver: zodResolver(addCouponSchema(formV)),
    mode: "onChange",
    defaultValues,
  });
  const type = form.watch("type");
  // const appliesTo = form.watch("applies_to");
  const couponType = form.watch("type");
  const couponValue = form.watch("value");
  const isGlobalForUsers = form.watch("is_global_for_users");
  const isGlobalForProducts = form.watch("is_global_for_products");
  const appliesTo = form.watch("applies_to");

  useEffect(() => {
    if (isGlobalForUsers === 1) {
      form.setValue("user_ids", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
    if (isGlobalForProducts == 1) {
      form.setValue("product_ids", undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [isGlobalForUsers, form, isGlobalForProducts]);

  function onSubmit(values: AddCouponSchema) {
    const parsed = addCouponSchema(formV).parse(values);
    const dirtyValues =
      getDirtyValues(form.formState.dirtyFields, values) ?? {};

    const payload = {
      ...dirtyValues,
      is_global_for_users: parsed.is_global_for_users,
      is_global_for_products: parsed.is_global_for_products ?? 0,
      type: parsed.type,
      is_company_sponsored: parsed.is_company_sponsored ? 1 : 0,
      // name: values.name,
      applies_to: parsed.applies_to,
      description: parsed.description,
      min_order_amount: parsed.min_order_amount,
    } as CreateCouponPayload;

    mutate(payload, {
      onSuccess: () => {
        if (onSuccess) {
          onSuccess();
        }
      },
    });
  }

  useEffect(() => {
    if (
      couponValue !== undefined &&
      couponValue !== null &&
      couponValue !== 0
    ) {
      form.trigger("value");
    }
  }, [couponType, form]);

  const loadSelectedProducts = async (productIds: string[]) => {
    if (!productIds || productIds.length === 0) {
      setSelectedProducts([]);
      return;
    }

    try {
      const promises = productIds.map((id) => {
        return fetchProductsClient({
          search: id,
          page: 1,
        });
      });

      const results = await Promise.all(promises);
      const products = results.flatMap((result) => result.data || []);
      setSelectedProducts(products);
    } catch (error) {
      console.error("Error loading selected products:", error);
    }
  };

  useEffect(() => {
    const productIds = form.watch("product_ids");
    if (productIds && productIds.length > 0) {
      loadSelectedProducts(productIds);
    } else {
      setSelectedProducts([]);
    }
  }, [form.watch("product_ids")]);

  const TypesOptions = [
    { label: formT("percentage"), value: "PERCENTAGE" },
    { label: formT("fixed"), value: "FIXED" },
  ];

  const AppliesToOptions = [
    {
      label: formT("appliesTo.products"),
      value: "PRODUCTS",
      icon: <Package className="size-4 mr-2" />,
    },
    {
      label: formT("appliesTo.shipping"),
      value: "SHIPPING",
      icon: <Truck className="size-4 mr-2" />,
    },
    {
      label: formT("appliesTo.CUSTOM_ORDER_SHIPPING"),
      value: "CUSTOM_ORDER_SHIPPING",
      icon: <Truck className="size-4 mr-2" />,
    },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <fieldset disabled={isPending} className="space-y-6 py-4 ">
          <div className="space-y-5">
            <FormSelect<AddCouponSchema>
              control={form.control}
              name="applies_to"
              label={formT("appliesTo.label")}
              options={AppliesToOptions}
              placeholder={formT("appliesTo.placeholder")}
              // Icon={<ShoppingCart className="size-4 text-muted-foreground" />}
            />

            <FormInput<AddCouponSchema>
              name="code"
              placeholder={formT("codePlaceholder")}
              label={formT("code")}
              autoComplete="off"
              Icon={<Hash className="size-4 text-muted-foreground" />}
            />

            <FormInput<AddCouponSchema>
              name="description"
              type="textarea"
              placeholder={formT("descriptionPlaceholder")}
              label={formT("description")}
              // rows={3}
              Icon={<FileText className="size-4 text-muted-foreground" />}
            />

            <FormInput<AddCouponSchema>
              name="usage_limit"
              type="number"
              placeholder={formT("usageLimitPlaceholder")}
              label={formT("usageLimit")}
              autoComplete="off"
              Icon={<Tag className="size-4 text-muted-foreground" />}
            />

            <FormRadio<AddCouponSchema>
              name="type"
              label={formT("discountType")}
              options={TypesOptions}
            />

            <FormInput<AddCouponSchema>
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

            <FormInput<AddCouponSchema>
              name="expires_at"
              type="datetime-local"
              placeholder={formT("expiresAtPlaceholder")}
              label={formT("expiresAt")}
              autoComplete="off"
              Icon={<Calendar className="size-4 text-muted-foreground" />}
            />

            <div className="space-y-4 border  rounded-lg p-[9px]">
              <h3 className="font-medium">{formT("usersSection")}</h3>

              <FormCheckbox
                name="is_global_for_users"
                label={formT("globalForUsers")}
                description={formT("globalForUsersDescription")}
              />

              {isGlobalForUsers == 0 && (
                <FormInfiniteMultiCombobox<AddCouponSchema, IUser>
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
                  getOptionLabel={(c) =>
                    `${c.first_name ?? ""} ${c.last_name ?? ""} ${
                      c.phone_number ?? ""
                    }`.trim()
                  }
                  getOptionValue={(c) => c.id || ""}
                  label={formT("selectUsers")}
                  disabled={isPending}
                />
              )}
            </div>

            {form.watch("applies_to") !== "CUSTOM_ORDER_SHIPPING" && (
              <>
                <FormInput<AddCouponSchema>
                  name="min_order_amount"
                  type="number"
                  step="0.01"
                  placeholder={formT("minOrderAmountPlaceholder")}
                  label={formT("minOrderAmount")}
                  autoComplete="off"
                  Icon={<DollarSign className="size-4 text-muted-foreground" />}
                />
                <div className="space-y-4 border rounded-lg p-[9px]">
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
                      <FormInfiniteMultiCombobox<AddCouponSchema, IProduct>
                        name="product_ids"
                        label={formT("selectProducts")}
                        queryKey={["products"]}
                        fetchFn={async (pageNumber: number, search: string) => {
                          const result = await fetchProductsClient({
                            search: search,
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
                          `${product.id}# - ${product.name} - ${
                            product.main_price || product.new_price
                          }`
                        }
                        getOptionValue={(product) => product?.id || ""}
                        disabled={isPending}
                      />
                    )
                  )}
                </div>
              </>
            )}

            {isGlobalForProducts == 0 &&
              !(type === "PERCENTAGE" && appliesTo === "SHIPPING") && (
                <div className="space-y-4 border rounded-lg p-[9px]">
                  <h3 className="font-medium">{formT("merchantsSection")}</h3>

                  <FormInfiniteMultiCombobox<AddCouponSchema, IUser>
                    name="merchant_ids"
                    queryKey={["merchants"]}
                    fetchFn={async (pageNumber: number, search: string) => {
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
              disabled={isPending}
              className="w-full  h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <Spinner className="w-4 h-4" />
                  <span>{formAc("create")}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>{formAc("create")}</span>
                </div>
              )}
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
