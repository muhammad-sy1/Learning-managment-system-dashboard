"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { FormRadio } from "@/components/form-fields/FormRadio";
import { useEffect } from "react";
import useUpdateOrder from "../../hooks/useUpdateOrder";
import {
  editStatusOrderSchema,
  EditStatusOrderSchema,
} from "../../schemas/editStatusOrderSchema";
import { IOrder } from "../../types/orders";

interface IProps {
  data: IOrder;
  onSuccess?: () => void;
}

export default function OrderStatusForm({ onSuccess, data }: IProps) {
  const { mutate, isPending } = useUpdateOrder();

  const t = useTranslations("Validation");
  const formT = useTranslations("Dashboard.OrdersPage");
  const ordersT = useTranslations("Dashboard.OrdersPage.statuses");

  const form = useForm<EditStatusOrderSchema>({
    resolver: zodResolver(editStatusOrderSchema(t)),
    // defaultValues: data.status,
  });

  function onSubmit(values: EditStatusOrderSchema) {
    mutate(
      { id: data.id, orderData: values },
      {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
        },
      }
    );
  }
  useEffect(() => {
    if (data) {
      form.reset({
        status: data.status || undefined,
      });
    }
  }, [data, form]);
  const statusOptions = [
    { label: ordersT("processing"), value: "PROCESSING" },
    { label: ordersT("shipped"), value: "DELEVIRING" },
    { label: ordersT("delivered"), value: "COMPLETED" },
    { label: ordersT("canceled"), value: "CANCELED" },
  ];

 
  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <fieldset disabled={isPending} className="space-y-6 py-4 px-1">
            <div className="space-y-5">
              <FormRadio<EditStatusOrderSchema>
                name="status"
                label={formT("fields.status")}
                options={statusOptions}
              />
            </div>

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
                    <span>{formT("actions.changeStatus")}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserPlus className="w-4 h-4" />
                    <span>{formT("actions.changeStatus")}</span>
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
