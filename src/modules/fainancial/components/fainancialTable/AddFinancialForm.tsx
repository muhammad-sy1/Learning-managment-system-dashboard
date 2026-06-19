"use client";

import FormDropZone from "@/components/form-fields/FormDropZone";
import FormInput from "@/components/form-fields/FormInput";
import FormSelectWithMapper from "@/components/form-fields/FormSelectWithMapper";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import { fetchSectionsClient } from "@/modules/sections/services/sections";
import { zodResolver } from "@hookform/resolvers/zod";
import { Folder, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { FAINANCIAL_Lists_TABLE_QUERY_KEY } from "../..";
import useCreateFainance from "../../hooks/Financials/useCreateFainance";
import { addFinancialSchema } from "../../schemas/Fainancial/addFinancialSchema";
import { IFinancialSubSection } from "../../types/fainancial";

interface IProps {
  onSuccess?: () => void;
  parent_id: string | undefined;
  type: string;
}

export default function AddFinancialForm({
  onSuccess,
  parent_id,
  type,
}: IProps) {
  const { mutate, isPending } = useCreateFainance(); // Updated hook
  const formT = useTranslations("Dashboard.SectionPage"); // Updated translation key
  const defaultValues: addFinancialSchema = {
    name: "",
    image: undefined as unknown as File,
    parent_id: parent_id,
  };
  const form = useForm<addFinancialSchema>({
    resolver: zodResolver(addFinancialSchema(formT)),
    defaultValues,
  });

  function onSubmit(values: addFinancialSchema) {
    const payload = {
      ...values,
      type: type,
      ...(parent_id ? { parent_id: Number(parent_id) } : {}),
    };
    mutate(payload, {
      onSuccess: () => {
        if (onSuccess) {
          onSuccess();
        }
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <fieldset disabled={isPending} className="space-y-6 py-4">
          <div className="space-y-5">
            <FormDropZone<addFinancialSchema> name="image" />
            <FormInput<addFinancialSchema>
              name="name"
              placeholder={formT("namePlaceholder")}
              label={formT("name")}
              autoComplete="off"
              Icon={<Folder className="size-4 text-muted-foreground" />}
            />
            {type === "FINANCIAL_SUB_SECTIONS" && (
              <FormSelectWithMapper<addFinancialSchema, IFinancialSubSection>
                name="parent_id"
                placeholder={formT("namePlaceholder")}
                label={formT("name")}
                queryKey={[FAINANCIAL_Lists_TABLE_QUERY_KEY]}
                fetchFn={() =>
                  fetchSectionsClient({ type: "FINANCIAL_MAIN_SECTIONS" })
                }
                getOptionArray={(data) => data?.sections?.data ?? []}
                getOptionLabel={(c) => c.name}
                getOptionValue={(c) => c.id}
                className="w-full"
              />
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isPending}
              variant={"premium"}
              className="w-full"
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <Spinner className="w-4 h-4" />
                  <span>{formT("creatingButton")}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>{formT("createButton")}</span>
                </div>
              )}
            </Button>
          </div>
        </fieldset>
      </form>
    </Form>
  );
}
