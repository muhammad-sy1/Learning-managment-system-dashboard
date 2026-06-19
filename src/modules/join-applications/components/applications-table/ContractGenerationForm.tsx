"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import FormSelect from "@/components/form-fields/FormSelect";
import FormInput from "@/components/form-fields/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import useGenerateApplicationContract from "../../hooks/useGenerateApplicationContract";
import {
  contractGenerationSchema,
  ContractGenerationSchema,
} from "../../schemas/contractGenerationSchema";
import { IApplications } from "../../types/applications";

interface IProps {
  data: IApplications;
  onSuccess?: () => void;
}

export default function ContractGenerationForm({ onSuccess, data }: IProps) {
  const { mutate, isPending } = useGenerateApplicationContract();
  const formT = useTranslations(
    "Dashboard.applicationsPage.contractGenerationForm",
  );

  const form = useForm<ContractGenerationSchema>({
    resolver: zodResolver(contractGenerationSchema()),
    defaultValues: {
      type: undefined,
      "app_commission": undefined,
    },
  });

  function onSubmit(values: ContractGenerationSchema) {
    mutate(
      { id: data.id, contractData: values },
      {
        onSuccess: () => {
          if (onSuccess) {
            onSuccess();
          }
          form.reset();
        },
      },
    );
  }

    const contractTypeOptions = [
      { label: formT("normal"), value: "normal" },
      { label: formT("special"), value: "custom" },
      { label: formT("restaurant"), value: "restaurant" },
    ];
  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <fieldset disabled={isPending} className="space-y-6 py-4 px-1">
            <div className="space-y-5">
              <FormSelect
                control={form.control}
                name="type"
                label={formT("contractType")}
                placeholder={formT("contractTypePlaceholder")}
                options={contractTypeOptions}
              />
              <FormInput
                name="app_commission"
                label={formT("ratio")}
                placeholder={formT("ratioPlaceholder")}
                description={formT("ratioDescription")}
                type="number"
                min="0"
                max="100"
                step="0.01"
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
                    <span>{formT("generating")}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>{formT("generate")}</span>
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
