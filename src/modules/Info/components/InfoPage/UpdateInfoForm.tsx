"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import Spinner from "@/components/ui/spinner";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { getDirtyValues } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useUpdateInfo from "../../hooks/useUpdateInfo";
import {
  UpdateInfoSchema,
  updateInfoSchema,
} from "../../schemas/UpdateInfoSchema";
import { AppTab } from "./update-info-form/AppTab";
import { GeneralTab } from "./update-info-form/GeneralTab";
import { mapInfoToFormValues } from "./update-info-form/helpers";
import { InfoTabsList } from "./update-info-form/InfoTabsList";
import { SocialTab } from "./update-info-form/SocialTab";
import { InfoTab, UpdateInfoFormProps } from "./update-info-form/types";

export default function UpdateInfoForm({
  data,
  onSuccess,
}: UpdateInfoFormProps) {
  const [activeTab, setActiveTab] = useState<InfoTab>("app");

  const t = useTranslations("Dashboard.InfoPage");
  const actionsT = useTranslations("Dashboard.InfoPage.actions");
  const validationT = useTranslations("Dashboard.InfoPage.validation");

  const { mutate, isPending } = useUpdateInfo();

  const form = useForm<UpdateInfoSchema>({
    resolver: zodResolver(updateInfoSchema(validationT)),
  });

  function onSubmit(values: UpdateInfoSchema) {
    const dirtyValues = getDirtyValues(form.formState.dirtyFields, values) ?? {};

    mutate(
      { payload: dirtyValues },
      {
        onSuccess: () => onSuccess?.(),
      },
    );
  }

  useEffect(() => {
    if (!data) return;

    form.reset(mapInfoToFormValues(data));
  }, [data, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-4">
        <fieldset disabled={isPending} className="space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as InfoTab)}
            className="w-full"
            dir="rtl"
          >
            <InfoTabsList t={t} />

            <TabsContent value="general" className="space-y-6">
              <GeneralTab form={form} t={t} />
            </TabsContent>

            <TabsContent value="app">
              <AppTab form={form} t={t} />
            </TabsContent>

            <TabsContent value="social" className="space-y-6">
              <SocialTab t={t} />
            </TabsContent>
          </Tabs>
        </fieldset>

        <div className="sticky bottom-0">
          <Button
            type="submit"
            disabled={isPending || !form.formState.isDirty}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {isPending ? (
              <div className="flex items-center space-x-2">
                <Spinner className="w-4 h-4" />
                <span>{actionsT("updating")}</span>
              </div>
            ) : (
              actionsT("update")
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
