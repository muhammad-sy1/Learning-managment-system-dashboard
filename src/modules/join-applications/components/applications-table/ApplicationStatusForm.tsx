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
  editStatusApplicationsSchema,
  EditStatusApplicationsSchema,
} from "../../schemas/editStatusOrderSchema";
import { IApplications, TApplicationStatus } from "../../types/applications";
import FormInput from "@/components/form-fields/FormInput";

interface IProps {
  data: IApplications;
  onSuccess?: () => void;
}

export default function ApplicationStatusForm({ onSuccess, data }: IProps) {
  const { mutate, isPending } = useUpdateOrder();

  // const t = useTranslations("Validation");
  const formT = useTranslations("Dashboard.applicationsPage.applicationsForm");
  const applicationStatusT = useTranslations(
    "Dashboard.applicationsPage.statuses",
  );

  const form = useForm<EditStatusApplicationsSchema>({
    resolver: zodResolver(editStatusApplicationsSchema()),
  });

  function onSubmit(values: EditStatusApplicationsSchema) {
    mutate(
      { id: data.id, applicationData: values },
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
        status: data.status || undefined,
        review_note: data.review_note || undefined,
      });
    }
  }, [data, form]);

  const applicationStatusOptions = [
    { label: applicationStatusT("submitted"), value: "submitted" },
    { label: applicationStatusT("approved"), value: "approved" },
    { label: applicationStatusT("rejected"), value: "rejected" },
    { label: applicationStatusT("under_review"), value: "under_review" },
  ] satisfies { label: string; value: TApplicationStatus }[];

  return (
    <div className="">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <fieldset disabled={isPending} className="space-y-6 py-4 px-1">
            <div className="space-y-5">
              <FormRadio<EditStatusApplicationsSchema>
                name="status"
                label={formT("status")}
                options={applicationStatusOptions}
              />
              <FormInput
                name="review_note"
                label={formT("reviewNote")}
                placeholder={formT("reviewNotePlaceholder")}
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
                    <span>{formT("changeStatus")}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <UserPlus className="w-4 h-4" />
                    <span>{formT("changeStatus")}</span>
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
