"use client";

import FormInfiniteCombobox from "@/components/form-fields/FormInfiniteCombobox";
import FormInput from "@/components/form-fields/FormInput";
import FormSelect from "@/components/form-fields/FormSelect";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Spinner from "@/components/ui/spinner";
import { SECTIONS_TABLE_QUERY_KEY } from "@/modules/sections";
import { fetchSectionsClient } from "@/modules/sections/services/sections";
import { ISection } from "@/modules/sections/types/section";
import { USERS_LISTS_QUERY_KEY } from "@/modules/users";
import { fetchUsersClient } from "@/modules/users/services/users";
import { IUser } from "@/modules/users/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, FileText, Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React from "react";
import { useForm } from "react-hook-form";
import { SUB_FAINANCIAL_TABLE_QUERY_KEY } from "../..";
import useCreateTransaction from "../../hooks/transactions/useCreateTransaction";
import {
  AddTransactionSchema,
  addTransactionSchema,
} from "../../schemas/Transactions/addTransactionSchema";

const defaultValues: AddTransactionSchema = {
  description: "",
  amount: "",
  section_id: undefined,
  date: undefined,
  currency: "SYP",
};

interface IProps {
  onSuccess?: () => void;
  section_id?: string | undefined;
}

export const categoryOptions = (formT: ReturnType<typeof useTranslations>) => [
  { value: "order_discount", label: formT("categoryOptions.orderDiscount") },
  {
    value: "shipping_discount",
    label: formT("categoryOptions.shippingDiscount"),
  },
  { value: "app_commission", label: formT("categoryOptions.appCommission") },
  { value: "other", label: formT("categoryOptions.other") },
];

export const currencyOptions = [
  { value: "SYP", label: "SYP" },
  { value: "USD", label: "USD" },
] as const;

export default function AddTransactionForm({ onSuccess }: IProps) {
  const { mutate, isPending } = useCreateTransaction();
  const formT = useTranslations("Dashboard.TransactionsPage");

  const form = useForm<AddTransactionSchema>({
    resolver: zodResolver(addTransactionSchema(formT)),
    defaultValues,
  });

  const chooseSection = form.watch("section_id");
  const selectedActorId = form.watch("actor_id");
  const hasSelectedActor =
    selectedActorId !== undefined &&
    selectedActorId !== null &&
    selectedActorId !== "";

  const [actorType, setActorType] = React.useState<
    "merchant" | "delivery" | null
  >(null);

  React.useEffect(() => {
    if (hasSelectedActor && form.getValues("currency") !== "SYP") {
      form.setValue("currency", "SYP", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [form, hasSelectedActor]);

  function onSubmit(values: AddTransactionSchema) {
    const payload = {
      ...values,
      section_id: values.sub_section_id || values.section_id,
      sub_section_id: undefined,
      actor_id: values.actor_id ? values.actor_id : null,
    };

    mutate(payload, {
      onSuccess: () => {
        form.reset(defaultValues);
        setActorType(null);
        onSuccess?.();
      },
    });
  }

  const handleClearActor = () => {
    setActorType(null);
    form.setValue("actor_id", undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <fieldset disabled={isPending} className="space-y-6 py-4">
          <div className="space-y-5">
            <FormInput
              name="description"
              placeholder={formT("placeholders.description")}
              label={formT("fields.description")}
              autoComplete="off"
              Icon={<FileText className="size-4 text-muted-foreground" />}
            />

            <FormInput
              name="amount"
              type="number"
              step="0.01"
              placeholder={formT("placeholders.amount")}
              label={formT("fields.amount")}
              autoComplete="off"
              Icon={<DollarSign className="size-4 text-muted-foreground" />}
            />

            <FormInput
              name="date"
              type="date"
              placeholder={formT("placeholders.date")}
              label={formT("fields.date")}
              autoComplete="off"
              Icon={<FileText className="size-4 text-muted-foreground" />}
            />

            <FormInfiniteCombobox<AddTransactionSchema, ISection>
              name="section_id"
              queryKey={[SECTIONS_TABLE_QUERY_KEY]}
              fetchFn={(page, search) =>
                fetchSectionsClient({
                  page,
                  type: "FINANCIAL_MAIN_SECTIONS",
                  search,
                }).then((res) => ({
                  current_page: res.data.sections.current_page,
                  last_page: res.data.sections.last_page,
                  total: res.data.sections.total ?? 0,
                  data: res.data.sections.data,
                }))
              }
              getOptionLabel={(section) => section.name}
              getOptionValue={(section) => section.id}
              placeholder={formT("fields.sectionId")}
              className="w-full"
            />

            <FormInfiniteCombobox<AddTransactionSchema, ISection>
              name="sub_section_id"
              queryKey={[SUB_FAINANCIAL_TABLE_QUERY_KEY, String(chooseSection)]}
              fetchFn={(page, search) => {
                if (!chooseSection) {
                  return Promise.resolve({
                    current_page: 1,
                    last_page: 1,
                    total: 0,
                    data: [],
                  });
                }

                return fetchSectionsClient({
                  page,
                  type: "FINANCIAL_SUB_SECTIONS",
                  search,
                  parent_id: String(chooseSection),
                }).then((res) => ({
                  current_page: res.data.sections.current_page,
                  last_page: res.data.sections.last_page,
                  total: res.data.sections.total ?? 0,
                  data: res.data.sections.data,
                }));
              }}
              disabled={!chooseSection}
              getOptionLabel={(section) => section.name}
              getOptionValue={(section) => section.id}
              placeholder={formT("fields.sub_sectionId")}
              className="w-full"
            />

            <div className="space-y-3">
              <div>{formT("fields.actorType")}</div>
              <div className="flex gap-4">
                <div className="w-1/3">
                  <RadioGroup
                    value={actorType ?? ""}
                    onValueChange={(value) =>
                      setActorType(value as "merchant" | "delivery")
                    }
                  >
                    <FieldLabel htmlFor="merchant_id">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>
                            {formT("placeholders.merchant")}
                          </FieldTitle>
                        </FieldContent>
                        <RadioGroupItem value="merchant" id="merchant_id" />
                      </Field>
                    </FieldLabel>
                    <FieldLabel htmlFor="delivery_id">
                      <Field orientation="horizontal">
                        <FieldContent>
                          <FieldTitle>
                            {formT("placeholders.delivery")}
                          </FieldTitle>
                        </FieldContent>
                        <RadioGroupItem value="delivery" id="delivery_id" />
                      </Field>
                    </FieldLabel>
                  </RadioGroup>
                </div>

                <div className="w-2/3 space-y-2">
                  <FormInfiniteCombobox<AddTransactionSchema, IUser>
                    name="actor_id"
                    queryKey={[USERS_LISTS_QUERY_KEY, actorType ?? ""]}
                    fetchFn={(page, search) =>
                      fetchUsersClient(
                        { page, search },
                        undefined,
                        actorType === "merchant"
                          ? "MERCHANT"
                          : actorType === "delivery"
                            ? "DELIVERY"
                            : "DELIVERY,MERCHANT",
                      )
                    }
                    getOptionLabel={(customer) =>
                      customer.first_name + " " + customer.last_name ||
                      customer.id + ""
                    }
                    getOptionValue={(customer) => Number(customer.id)}
                    placeholder={
                      actorType === "merchant"
                        ? formT("placeholders.chooseMerchant")
                        : actorType === "delivery"
                          ? formT("placeholders.chooseDelivery")
                          : formT("placeholders.chooseDeliveryOrMerchant")
                    }
                    className="w-full"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearActor}
                    disabled={!hasSelectedActor}
                    className="w-full"
                  >
                    <X className="size-4" />
                    <span>{formT("buttons.clearActor")}</span>
                  </Button>
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>{formT("fields.currency")}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={hasSelectedActor}
                      className="flex gap-6"
                    >
                      {currencyOptions.map((option) => {
                        const id = `add-transaction-currency-${option.value}`;

                        return (
                          <div
                            key={option.value}
                            className="flex items-center gap-2"
                          >
                            <RadioGroupItem value={option.value} id={id} />
                            <FormLabel htmlFor={id} className="mb-0 font-normal">
                              {option.label}
                            </FormLabel>
                          </div>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormSelect<AddTransactionSchema>
              control={form.control}
              name="category"
              options={categoryOptions(formT)}
              label={formT("transactionType")}
              placeholder={formT("placeholders.transactionType")}
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              disabled={isPending}
              variant="premium"
              className="w-full"
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <Spinner className="h-4 w-4" />
                  <span>{formT("buttons.creatingButton")}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>{formT("buttons.createButton")}</span>
                </div>
              )}
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
