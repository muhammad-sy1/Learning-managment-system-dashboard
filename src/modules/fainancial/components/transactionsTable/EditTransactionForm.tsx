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
import { usePermissionStore } from "@/hooks/usePermissionStore";
import { fetchSectionsClient } from "@/modules/sections/services/sections";
import { USERS_LISTS_QUERY_KEY } from "@/modules/users";
import { fetchUsersClient } from "@/modules/users/services/users";
import { IUser } from "@/modules/users/types/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { DollarSign, FileText, X } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  FAINANCIAL_TABLE_QUERY_KEY,
  SUB_FAINANCIAL_TABLE_QUERY_KEY,
} from "../..";
import useUpdateTransaction from "../../hooks/transactions/useUpdateTransaction";
import {
  EditTransactionSchema,
  editTransactionSchema,
} from "../../schemas/Transactions/editTransactionSchema";
import { ISectionTransaction, ITransaction } from "../../types/transaction";
import { categoryOptions, currencyOptions } from "./AddTransactionForm";

interface IEditTransactionFormProps {
  data: ITransaction;
  onSuccess?: () => void;
}

export default function EditTransactionForm({
  data,
  onSuccess,
}: IEditTransactionFormProps) {
  const { mutate, isPending } = useUpdateTransaction();
  const formT = useTranslations("Dashboard.TransactionsPage");
  const { hasPermission } = usePermissionStore();
  const form = useForm<EditTransactionSchema>({
    resolver: zodResolver(editTransactionSchema(formT)),
  });

  const [actorType, setActorType] = React.useState<
    "merchant" | "delivery" | null
  >(null);

  useEffect(() => {
    if (data) {
      form.reset({
        description: data.description || "",
        amount: data.amount || "",
        section_id: data.section?.parent
          ? data.section.parent.id.toString()
          : data.section.id.toString(),
        date: data.date,
        sub_section_id: data.section?.parent
          ? data.section.id.toString()
          : undefined,
        actor_id: data.actor?.id ?? undefined,
        currency: data.currency ?? "SYP",
        category: data.category || "",
      });
    }
  }, [data, form]);

  const chooseSection = form.watch("section_id");
  const selectedActorId = form.watch("actor_id");
  const hasSelectedActor =
    selectedActorId !== undefined &&
    selectedActorId !== null &&
    selectedActorId !== "";
  const selectedUser:
    | { id: number; first_name: string; last_name: string }
    | undefined = data.actor ?? undefined;

  useEffect(() => {
    if (hasSelectedActor && form.getValues("currency") !== "SYP") {
      form.setValue("currency", "SYP", {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [form, hasSelectedActor]);

  function onSubmit(values: EditTransactionSchema) {
    const payload = {
      ...values,
      section_id: values.sub_section_id || values.section_id,
      sub_section_id: undefined,
      actor_id: values.actor_id ? values.actor_id : null,
    };

    mutate(
      {
        id: data.id,
        transactionData: payload,
      },
      {
        onSuccess: () => {
          onSuccess?.();
        },
      },
    );
  }

  const handleClearActor = () => {
    setActorType(null);
    form.setValue("actor_id", undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <fieldset disabled={isPending} className="space-y-6">
            <FormInput<EditTransactionSchema>
              name="description"
              placeholder={formT("placeholders.description")}
              label={formT("fields.description")}
              autoComplete="off"
              Icon={<FileText className="size-4 text-muted-foreground" />}
            />

            <FormInput<EditTransactionSchema>
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

            <FormInfiniteCombobox<EditTransactionSchema, ISectionTransaction>
              name="section_id"
              queryKey={[FAINANCIAL_TABLE_QUERY_KEY]}
              fetchFn={(page, search) => {
                if (hasPermission("finance.view")) {
                  return fetchSectionsClient({
                    page,
                    type: "FINANCIAL_MAIN_SECTIONS",
                    search,
                  }).then((res) => ({
                    current_page: res.data.sections.current_page,
                    last_page: res.data.sections.last_page,
                    total: res.data.sections.total ?? 0,
                    data: res.data.sections.data,
                  }));
                }

                return Promise.resolve({
                  current_page: 1,
                  last_page: 1,
                  total: 1,
                  data: data.section.parent
                    ? []
                    : [{ id: data.section.id, name: data.section.name }],
                } satisfies IPaginatedResponse<ISectionTransaction>);
              }}
              disabled={!hasPermission("finance.view")}
              getOptionLabel={(section) => section.name}
              getOptionValue={(section) => section.id}
              placeholder={formT("fields.sectionId")}
              className="w-full"
            />

            <FormInfiniteCombobox<EditTransactionSchema, ISectionTransaction>
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

                if (hasPermission("sub-finance.view")) {
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
                }

                return Promise.resolve({
                  current_page: 1,
                  last_page: 1,
                  total: 1,
                  data: data.section.parent
                    ? [{ id: data.section.id, name: data.section.name }]
                    : [],
                } satisfies IPaginatedResponse<ISectionTransaction>);
              }}
              disabled={!chooseSection || !hasPermission("sub-finance.view")}
              getOptionLabel={(section) => section.name}
              getOptionValue={(section) => section.id}
              placeholder={formT("fields.sectionId")}
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
                  <FormInfiniteCombobox<EditTransactionSchema, IUser>
                    name="actor_id"
                    queryKey={[USERS_LISTS_QUERY_KEY, actorType ?? "ALL"]}
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
                      customer.first_name + " " + customer.last_name
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
                    initialOption={selectedUser as IUser}
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
                        const id = `edit-transaction-currency-${option.value}`;

                        return (
                          <div
                            key={option.value}
                            className="flex items-center gap-2"
                          >
                            <RadioGroupItem value={option.value} id={id} />
                            <FormLabel
                              htmlFor={id}
                              className="mb-0 font-normal"
                            >
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

            <FormSelect<EditTransactionSchema>
              control={form.control}
              name="category"
              options={categoryOptions(formT)}
              label={formT("transactionType")}
              placeholder={formT("placeholders.transactionType")}
            />

            <Button
              disabled={isPending || !form.formState.isDirty}
              className="h-12 w-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <Spinner className="w-4 h-4" />
                  <span>{formT("buttons.updatingButton")}</span>
                </div>
              ) : (
                formT("buttons.updateButton")
              )}
            </Button>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}
