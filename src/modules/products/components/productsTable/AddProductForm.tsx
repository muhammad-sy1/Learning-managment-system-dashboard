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
import { fetchZonesClient } from "@/modules/provinces/services/zones";
import { SECTIONS_TABLE_QUERY_KEY } from "@/modules/sections";
import { fetchSectionsClient } from "@/modules/sections/services/sections";
import { ISection } from "@/modules/sections/types/section";
import { USERS_TABLE_QUERY_KEY } from "@/modules/users";
import { fetchUsersClient } from "@/modules/users/services/users";
import { IUser } from "@/modules/users/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { PRODUCTS_TABLE_QUERY_KEY } from "../..";
import useCreateProduct from "../../hooks/useCreateProduct";
import {
  AddProductFormValues,
  addProductSchema,
} from "../../schemas/AddProductSchema";
import DropZoneWithColorPicker from "./DropZoneWithColorPicker";
import FormSizesField from "./FormSizesField";

const defaultValues: AddProductFormValues = {
  images: [],
  section_id: undefined,
  name: "",
  description: "",
  main_price: undefined,
  new_price: undefined,
  merchant_id: undefined,
  weight: undefined,
  is_out_of_stock: 0,
  discount_start_date: "",
  is_refundable: 0,
  avg_preparation_minutes: "",
  discount_end_date: "",
  video_url: "",
  sizes: [],
  options: [],
  main_price_usd: undefined,
  new_price_usd: undefined,
  is_price_linked_to_usd: "0",
  zones_ids: [],
  
};

interface IProps {
  onSuccess?: () => void;
  isSupProduct?: boolean;
  parentId?: number;
}

export default function AddProductForm({
  onSuccess,
  isSupProduct,
  parentId,
}: IProps) {
  const { mutate, isPending } = useCreateProduct();

  const searchParams = useSearchParams();

  const parent_id = searchParams.get("parent_id") ?? undefined;

  const [selectedMerchant, setSelectedMerchant] = useState<IUser | null>(null);

  const namespace = isSupProduct
    ? "Dashboard.SubProductPage"
    : "Dashboard.ProductPage";

  const formT = useTranslations(namespace);

  const form = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductSchema(formT, isSupProduct)),
    defaultValues,
  });


  const { hasPermission } = usePermissionStore();

  const selectedSection = form.watch("section_id");

  function onSubmit(values: AddProductFormValues) {
    const payload = isSupProduct
      ? {
        ...values,
        images: undefined,
        parent_id: parentId ?? parent_id,
        sub_section_id: undefined,
        section_id: values.sub_section_id || values.section_id,
      }
      : {
        ...values,
        parent_id: parent_id,
        sub_section_id: undefined,
        section_id: values.sub_section_id || values.section_id,
      };

    mutate(payload, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  }

  const [enabled, setEnabled] = useState(false);

  const handleToggle = (checked: boolean) => {
    setEnabled(checked);

    if (checked) {
      form.setValue("is_price_linked_to_usd", "1", {
        shouldDirty: true,
        shouldValidate: true,
      });
    } else {
      form.setValue("is_price_linked_to_usd", "0", {
        shouldDirty: true,
        shouldValidate: true,
      });
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.error("Form validation failed:", errors);
        })}
        className="space-y-6"
      >
        <fieldset disabled={isPending} className="space-y-6 py-4">
          {!isSupProduct && (
            <DropZoneWithColorPicker<AddProductFormValues>
              name="images"
              label={formT("fields.images")}
            // description={formT("fields.imagesDescription")}
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
                type="text"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInfiniteCombobox<AddProductFormValues, ISection>
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
                    data: [],
                  } satisfies IPaginatedResponse<ISection>);
                }
              }}
              label={formT("fields.parentSection")}
              getOptionLabel={(section) => section.name}
              getOptionValue={(section) => section.id}
              placeholder={formT("fields.parentSection")}
              className="w-full"
              disabled={!hasPermission("sections.view")}
            />

            
            <FormInfiniteCombobox<AddProductFormValues, ISection>
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

            <FormInfiniteCombobox<AddProductFormValues, IUser>
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
              onSelectOption={(user) => {
                if (user) {
                  setSelectedMerchant(user);
                }
              }}
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

          {selectedMerchant?.store_type === "RESTURANT" && (
            <FormInput
              name="avg_preparation_minutes"
              placeholder={formT("fields.avg_preparation_minutes")}
              label={formT("fields.avg_preparation_minutes")}
              autoComplete="off"
            />
          )}

          {selectedMerchant?.store_type !== "RESTURANT" && (
            <FormSizesField
              name="sizes"
              label={formT("fields.sizes")}
              placeholder={formT("fields.sizePlaceholder")}
            />
          )}

             <FormSizesField
              name="options"
              label={formT("fields.options")}
              placeholder={formT("fields.sizePlaceholder")}
            />



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
              disabled={isPending}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <Spinner className="w-4 h-4" />
                  <span>{formT("actions.create")}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>{formT("actions.create")}</span>
                </div>
              )}
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
