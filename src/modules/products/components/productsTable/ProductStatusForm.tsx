"use client";

import FormInput from "@/components/form-fields/FormInput";
import { FormRadio } from "@/components/form-fields/FormRadio";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { Package, UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import useUpdateStatusProduct from "../../hooks/useUpdateStatusProduct";
import {
  editStatusProductSchema,
  EditStatusProductSchema,
} from "../../schemas/editStatusProductSchema";
import { IProduct } from "../../types/products";

interface IProps {
  data: IProduct;
  onSuccess?: () => void;
}

export default function ProductStatusForm({ onSuccess, data }: IProps) {
  const { mutate, isPending } = useUpdateStatusProduct();

  const formT = useTranslations("Dashboard.ProductPage");
  const ordersT = useTranslations("Dashboard.ProductPage.statuses");

  const form = useForm<EditStatusProductSchema>({
    resolver: zodResolver(editStatusProductSchema(formT)),
    mode: "onChange",
    // defaultValues: data.status,
  });
  const watchedStatus = form.watch("status");

  function onSubmit(values: EditStatusProductSchema) {
    mutate(
      { id: data.id, productData: values },
      {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
        },
      },
    );
  }
  useEffect(() => {
    if (data) {
      form.reset({
        status: data.status as "APPROVED" | "REJECTED" | "PENDING",
        reject_reason: data.reject_reason || "",
      });
    }
  }, [data, form]);
  const statusOptions = [
    { label: ordersT("approve"), value: "APPROVED" },
    { label: ordersT("rejecte"), value: "REJECTED" },
    { label: ordersT("pending"), value: "PENDING" },
  ];

  return (
    <div className="">
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <fieldset disabled={isPending} className="space-y-6 py-4 px-1">
            <div className="space-y-5">
              <FormRadio<EditStatusProductSchema>
                name="status"
                label={formT("fields.status")}
                options={statusOptions}
              />
            </div>
            {watchedStatus === "REJECTED" && (
              <FormInput
                name="reject_reason"
                placeholder={formT("fields.reject_reason")}
                label={formT("fields.reject_reason")}
                autoComplete="off"
                Icon={<Package className="size-4 text-muted-foreground" />}
              />
            )}
            {/* Submit Button */}
            <div className="pt-4 px-1 pb-1">
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
                    <UserPlus className="w-4 h-4" />
                    <span>{formT("actions.update")}</span>
                  </div>
                )}
              </Button>
            </div>
          </fieldset>
        </form>
      </FormProvider>
    </div>
  );
}
