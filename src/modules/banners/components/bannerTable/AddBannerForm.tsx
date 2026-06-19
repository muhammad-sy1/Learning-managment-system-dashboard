"use client";

import FormInput from "@/components/form-fields/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";

import FormDropZone from "@/components/form-fields/FormDropZone";
import FormInfiniteCombobox from "@/components/form-fields/FormInfiniteCombobox";
import FormSelect from "@/components/form-fields/FormSelect";
import { PRODUCTS_TABLE_QUERY_KEY } from "@/modules/products";
import { fetchProductsClient } from "@/modules/products/services/products";
import { IProduct } from "@/modules/products/types/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import useCreateBanner from "../../hooks/useCreateBanner";
import {
  addBannerSchema,
  AddBannerSchema,
} from "../../schemas/addBannerSchema";

interface IProps {
  onSuccess?: () => void;
  type: string;
}

const defaultValues: AddBannerSchema = {
  file: null,
  url: undefined,
  expires_at: "",
  show_time: "",
  product_id: undefined,
  target: "url",
};

export default function Banner({ onSuccess, type }: IProps) {
  const { mutate, isPending } = useCreateBanner({ type });
  const formT = useTranslations("Dashboard.BannersPage.fields");
  const formAc = useTranslations("Dashboard.BannersPage.actions");
  const formV = useTranslations("Dashboard.BannersPage.validation");

  const form = useForm<AddBannerSchema>({
    resolver: zodResolver(addBannerSchema(formV)),
    defaultValues,
    mode: "onChange",
  });

  function onSubmit(values: AddBannerSchema) {
    const parsed = addBannerSchema(formV).parse(values);
    mutate(parsed, {
      onSuccess: () => {
        if (onSuccess) {
          onSuccess();
        }
      },
    });
  }

  const targetOptions = [
    { value: "url", label: formT("urlType") },
    { value: "product", label: formT("productType") },
  ];
  const target = form.watch("target");

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <fieldset disabled={isPending} className="space-y-6 py-4 px-1">
          <div className="space-y-5">
            <FormDropZone<AddBannerSchema> name="file" allowVideo={true} />
            <FormInput<AddBannerSchema>
              name="show_time"
              type="number"
              placeholder={formT("showTimePlaceholder")}
              label={formT("showTime")}
            />
            <FormInput<AddBannerSchema>
              name="expires_at"
              type="datetime-local"
              label={formT("expiresAt")}
            />
            <FormSelect<AddBannerSchema>
              control={form.control}
              name="target"
              options={targetOptions}
              label={formT("target")}
            />
            {target == "url" && (
              <FormInput<AddBannerSchema>
                name="url"
                label={formT("url")}
                placeholder={formT("url")}
              />
            )}
            {target == "product" && (
              <FormInfiniteCombobox<AddBannerSchema, IProduct>
                name="product_id"
                queryKey={[PRODUCTS_TABLE_QUERY_KEY]}
                fetchFn={(page, search) =>
                  fetchProductsClient({ page, search, status: "APPROVED" })
                }
                getOptionLabel={(product) => product.name ?? ""}
                getOptionValue={(product) => product.id ?? ""}
                label={formT("product")}
                placeholder={formT("product")}
                className="w-full"
                // disabled={!hasPermission("products.view")}
              />
            )}
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
