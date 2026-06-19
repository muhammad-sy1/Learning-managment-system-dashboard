"use client";

import FormDropZone from "@/components/form-fields/FormDropZone";
import FormInfiniteCombobox from "@/components/form-fields/FormInfiniteCombobox";
import FormInput from "@/components/form-fields/FormInput";
import FormSelect from "@/components/form-fields/FormSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import { getDirtyValues } from "@/lib/utils";
import { PRODUCTS_TABLE_QUERY_KEY } from "@/modules/products";
import { fetchProductsClient } from "@/modules/products/services/products";
import { IProduct } from "@/modules/products/types/products";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useUpdateBanner from "../../hooks/useUpdateBanner";
import {
  editBannerSchema,
  EditBannerSchema,
} from "../../schemas/editBannerSchema";
import { IBanner } from "../../types/banner";
import { formatUtcToLocal } from "@/utils/formatDate";

interface IEditBannerFormProps {
  data: IBanner;
  onSuccess?: () => void;
}

export default function EditBannerForm({
  data,
  onSuccess,
}: IEditBannerFormProps) {
  const { mutate, isPending } = useUpdateBanner();
  const formT = useTranslations("Dashboard.BannersPage.fields");
  const formAc = useTranslations("Dashboard.BannersPage.actions");
  const formV = useTranslations("Dashboard.BannersPage.validation");
  const form = useForm<EditBannerSchema>({
    resolver: zodResolver(editBannerSchema(formV)),
  });
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  function onSubmit(values: EditBannerSchema) {
    const dirtyValues =
      getDirtyValues(form.formState.dirtyFields, values) ?? {};

    mutate(
      { id: data.id, bannerData: dirtyValues },
      {
        onSuccess: () => onSuccess?.(),
      },
    );
  }

  const targetOptions = [
    { value: "url", label: formT("urlType") },
    { value: "product", label: formT("productType") },
  ];

  const target = form.watch("target");

  useEffect(() => {
    if (data) {
      form.reset({
        file: data?.file
          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${data?.file}`
          : "",

        show_time: data.show_time,
        product_id: data.product?.id?.toString(),
        target: data.target as "url" | "product",
        url: data.url ?? undefined,
        expires_at: formatUtcToLocal(data.expires_at),
      });
    }
  }, [data, form]);

  const tempProduct = data.product
    ? ({
        id: data.product.id,
        name: data.product.name,
      } as unknown as IProduct)
    : undefined;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <fieldset disabled={isPending} className="space-y-6 py-4">
          <FormDropZone<EditBannerSchema>
            name="file"
            allowVideo={type === "HOME" ? false : true}
          />

          <FormInput<EditBannerSchema>
            name="show_time"
            type="number"
            placeholder={formT("showTimePlaceholder")}
            label={formT("showTime")}
          />
          <FormInput<EditBannerSchema>
            name="expires_at"
            type="datetime-local"
            label={formT("expiresAt")}
          />
          <FormSelect<EditBannerSchema>
            control={form.control}
            name="target"
            options={targetOptions}
            label={formT("target")}
          />
          {target == "url" && (
            <FormInput<EditBannerSchema>
              name="url"
              label={formT("url")}
              placeholder={formT("url")}
            />
          )}
          {target == "product" && (
            <FormInfiniteCombobox<EditBannerSchema, IProduct>
              name="product_id"
              queryKey={[PRODUCTS_TABLE_QUERY_KEY]}
              fetchFn={(page, search) =>
                fetchProductsClient({ page, search, status: "APPROVED" })
              }
              getOptionLabel={(product) => product.name}
              getOptionValue={(product) => product.id}
              initialOption={tempProduct}
              label={formT("product")}
              placeholder={formT("product")}
              className="w-full"
              // disabled={!hasPermission("products.view")}
            />
          )}

          <Button
            disabled={isPending || !form.formState.isDirty}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {isPending ? (
              <div className="flex items-center space-x-2">
                <Spinner className="w-4 h-4" />
                <span>{formAc("update")}</span>
              </div>
            ) : (
              formAc("update")
            )}
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
