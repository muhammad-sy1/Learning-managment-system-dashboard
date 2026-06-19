"use client";

import FormInfiniteCombobox from "@/components/form-fields/FormInfiniteCombobox";
import FormInput from "@/components/form-fields/FormInput";
import FormMultiSelectWithMapper from "@/components/form-fields/FormMultiSelectWithMapper";
import FormSwitch from "@/components/form-fields/FormSwitch";
import FormTextarea from "@/components/form-fields/FormTextarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { usePermissionStore } from "@/hooks/usePermissionStore";
import { getDirtyValues } from "@/lib/utils";
import { fetchZonesClient } from "@/modules/provinces/services/zones";
import { SECTIONS_TABLE_QUERY_KEY } from "@/modules/sections";
import { fetchSectionsClient } from "@/modules/sections/services/sections";
import { USERS_TABLE_QUERY_KEY } from "@/modules/users";
import { fetchUsersClient } from "@/modules/users/services/users";
import { IUser } from "@/modules/users/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { PRODUCTS_TABLE_QUERY_KEY } from "../..";
import useUpdateProduct from "../../hooks/useUpdateProduct";
import {
  EditProductSchema,
  editProductSchema,
} from "../../schemas/editProductSchema";
import { ISection } from "../../types/productLogs";
import type { IProduct } from "../../types/products";
import DropZoneWithColorPicker from "./DropZoneWithColorPicker";
import FormSizesField from "./FormSizesField";

interface IEditProductFormProps {
  product: IProduct;
  onSuccess?: () => void;
  isSubProduct?: boolean;
}

export default function EditProductForm({
  product,
  isSubProduct,
  onSuccess,
}: IEditProductFormProps) {
  const { mutate, isPending } = useUpdateProduct();
  const formT = useTranslations("Dashboard.ProductPage");
  const { hasPermission } = usePermissionStore();

  const form = useForm<EditProductSchema>({
    resolver: zodResolver(editProductSchema(formT, isSubProduct)),
  });

  const selectedSection = form.watch("section_id");
  function onSubmit(values: EditProductSchema) {
    const dirty = getDirtyValues(form.formState.dirtyFields, values) ?? {};

    if ("images" in dirty && Array.isArray(values.images)) {
      (dirty as any).images = values.images.map((img: any) => {
        if (img?.isPreview && img?.file) {
          return { file: img.file, ...(img.color ? { color: img.color } : {}) };
        } else {
          return {
            serverId: img.serverId,
            ...(img.color ? { color: img.color } : { color: "" }),
            ...(img.is_blur ? { is_blur: img.is_blur } : { is_blur: 0 }),
          };
        }
      });
    }
    const payload = {
      ...dirty,
      section_id: values.sub_section_id || values.section_id,
      sub_section_id: undefined,
    };
    mutate({ id: product.id, productData: payload }, { onSuccess: onSuccess });
  }

  const enabled = form.watch("is_price_linked_to_usd") === 1;

  // useEffect(() => {
  //   setEnabled(product?.is_price_linked_to_usd === 1);
  // }, [product]);

  const handleToggle = (checked: boolean) => {
    // setEnabled(checked);

    form.setValue("is_price_linked_to_usd", checked ? 1 : 0, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (!checked) {
      form.setValue("main_price_usd", null, {
        shouldDirty: true,
        shouldValidate: true,
      });
      form.setValue("new_price_usd", null, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  useEffect(() => {
    if (product) {
      const sizesArray = product.sizes ? product?.sizes?.split(";") : [""];
      const optionsArray = product.options ? product?.options?.split(";") : [""];

      form.reset({
        name: product.name || "",
        description: product.description || "",
        // section_id: product.section.id.toString(),
        section_id: product.section?.parent
          ? product.section.parent.id.toString()
          : product.section.id.toString(),
        sub_section_id: product.section?.parent
          ? product.section.id.toString()
          : undefined,

        main_price: product.main_price,
        new_price: product.new_price,
        main_price_usd: product.main_price_usd,
        new_price_usd: product.new_price_usd,
        weight: product.weight || "",
        is_out_of_stock: product.is_out_of_stock === 1 ? 1 : 0,
        discount_start_date: product.discount_start_date || "",
        discount_end_date: product.discount_end_date || "",
        sizes: sizesArray,
        options: optionsArray,

        video_url: product.video_url || "",
        merchant_id: product?.merchant?.id.toString() ?? "",
        type: product.type,
        images:
          product.images?.map((img) => ({
            serverId: img.id,
            url: img.image,
            file: null,
            color: img.color || "",
            isPreview: false,
            markedForDelete: false,
            is_blur: img.is_blur,
          })) || [],
        zones_ids: product.zones?.map((p) => p.id.toString()) || [],
        is_price_linked_to_usd: product.is_price_linked_to_usd,
        is_refundable: product.is_refundable,
      });
    }
  }, [product, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form validation failed:", errors);
        })}
        className="space-y-6"
      >
        <fieldset disabled={isPending} className="space-y-6 py-4">
          {!isSubProduct && (
            <DropZoneWithColorPicker<EditProductSchema>
              name="images"
              label={formT("fields.images")}
              description={formT("imagesDescription")}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-5">
              <FormInput
                name="name"
                placeholder={formT("fields.namePlaceholder")}
                label={formT("fields.name")}
                autoComplete="off"
                Icon={<Package className="size-4 text-muted-foreground" />}
              />

              <FormTextarea
                name="description"
                placeholder={formT("fields.descriptionPlaceholder")}
                label={formT("fields.description")}
                autoComplete="off"
              />
            </div>

            {/* Pricing & Stock */}
            <div className="space-y-5">
              <FormInput
                name="weight"
                placeholder={formT("fields.weightPlaceholder")}
                label={formT("fields.weight")}
                autoComplete="off"
              />

              <FormInput
                name="video_url"
                placeholder={formT("fields.videoUrlPlaceholder")}
                label={formT("fields.videoUrl")}
                autoComplete="off"
                onChange={(e) => {
                  const value = e.target.value.trim();
                  form.setValue("video_url", value === "" ? null : value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
              />

              <FormSwitch
                name="is_refundable"
                title={formT("fields.isRefundable")}
              />

              <FormSwitch
                name="is_out_of_stock"
                title={formT("fields.outOfStockLabel")}
              />
            </div>
            <div className="col-span-2">
              <div className="flex items-center justify-between border p-4 rounded">
                <label className="text-sm font-medium">
                  {formT("fields.isPriceLinkedToUSD")}
                </label>
                <Switch
                  dir="ltr"
                  checked={enabled}
                  onCheckedChange={handleToggle}
                />
              </div>
            </div>
            <div className="space-y-5">
              <FormInput
                name="main_price"
                type="number"
                step="0.01"
                placeholder={formT("fields.mainPricePlaceholder")}
                label={formT("fields.mainPrice")}
                autoComplete="off"
              />

              <FormInput
                name="new_price"
                type="number"
                step="0.01"
                placeholder={formT("fields.newPricePlaceholder")}
                label={formT("fields.newPrice")}
                autoComplete="off"
              />
            </div>
            {enabled && (
              <div className="space-y-5">
                <FormInput
                  name="main_price_usd"
                  type="number"
                  step="0.01"
                  placeholder={formT("fields.mainUSDPricePlaceholder")}
                  label={formT("fields.mainUSDPrice")}
                  autoComplete="off"
                />
                <FormInput
                  name="new_price_usd"
                  type="number"
                  step="0.01"
                  placeholder={formT("fields.newUSDPricePlaceholder")}
                  label={formT("fields.newUSDPrice")}
                  autoComplete="off"
                />
              </div>
            )}
          </div>

          {/* Sizes Component - Much Cleaner! */}
          <FormSizesField
            name="sizes"
            label={formT("fields.sizes")}
            placeholder={formT("fields.sizePlaceholder")}
          />
          <FormSizesField
            name="options"
            label={formT("fields.options")}
            placeholder={formT("fields.sizePlaceholder")}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInfiniteCombobox<EditProductSchema, ISection>
              name="section_id"
              queryKey={[SECTIONS_TABLE_QUERY_KEY]}
              fetchFn={(page, search) => {
                if (hasPermission("sections.view")) {
                  return fetchSectionsClient({
                    page,
                    type: "CATIGORIES",
                    search,
                  }).then((res) => ({
                    current_page: res.data.sections.current_page,
                    last_page: res.data.sections.last_page,
                    total: res.data.sections.total ?? 0,
                    data: res.data.sections.data,
                  }));
                } else {
                  return Promise.resolve({
                    current_page: 1,
                    last_page: 1,
                    total: 1,
                    data: [
                      {
                        id: product.section.id,
                        name: product.section.name,
                      },
                    ],
                  } satisfies IPaginatedResponse<ISection>);
                }
              }}
              label={formT("fields.section")}
              getOptionLabel={(section) => section.name}
              getOptionValue={(section) => section.id}
              placeholder={formT("fields.section")}
              className="w-full"
              disabled={!hasPermission("sections.view")}
            />

            <FormInfiniteCombobox<EditProductSchema, ISection>
              name="sub_section_id"
              queryKey={[String(selectedSection) || SECTIONS_TABLE_QUERY_KEY]}
              fetchFn={(page, search) => {
                if (hasPermission("sections.view")) {
                  if (!selectedSection)
                    return Promise.resolve({
                      current_page: 1,
                      last_page: 1,
                      total: 1,
                      data: [],
                    } satisfies IPaginatedResponse<ISection>);
                  return fetchSectionsClient({
                    page,
                    type: "SUB_CATIGORIES",
                    parent_id: String(selectedSection) ?? undefined,
                    search,
                  }).then((res) => ({
                    current_page: res.data.sections.current_page,
                    last_page: res.data.sections.last_page,
                    total: res.data.sections.total ?? 0,
                    data: res.data.sections.data,
                  }));
                } else {
                  return Promise.resolve({
                    current_page: 1,
                    last_page: 1,
                    total: 1,
                    data: [],
                  } satisfies IPaginatedResponse<ISection>);
                }
              }}
              label={formT("fields.subSection")}
              getOptionLabel={(section) => section.name}
              getOptionValue={(section) => section.id}
              placeholder={formT("fields.subSection")}
              className="w-full"
              disabled={!hasPermission("sections.view")}
            />

            <FormInfiniteCombobox<EditProductSchema, IUser>
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
                user.first_name ?? "" + user.phone_number
              }
              getOptionValue={(user) => user.id}
              label={formT("fields.merchantId")}
              placeholder={formT("fields.merchantId")}
            />

            <FormMultiSelectWithMapper
              name="zones_ids"
              label={formT("fields.availableProvinces")}
              placeholder={formT("fields.selectProvinces")}
              queryKey={[PRODUCTS_TABLE_QUERY_KEY]}
              fetchFn={() => fetchZonesClient()}
              getOptionArray={(data) => data ?? []}
              getOptionLabel={(p) => p.name}
              getOptionValue={(p) => p.id.toString()}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              name="discount_start_date"
              type="datetime-local"
              label={formT("fields.discountStartDate")}
            />
            <FormInput
              name="discount_end_date"
              type="datetime-local"
              label={formT("fields.discountEndDate")}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isPending || !form.formState.isDirty}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <Spinner className="w-4 h-4" />
                  <span>{formT("actions.update")}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>{formT("actions.update")}</span>
                </div>
              )}
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
