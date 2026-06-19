"use client";

import FormInput from "@/components/form-fields/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import FormDropZone from "@/components/form-fields/FormDropZone";
import FormSelectWithMapper from "@/components/form-fields/FormSelectWithMapper";
import Spinner from "@/components/ui/spinner";
import { getDirtyValues } from "@/lib/utils";
import { useEffect } from "react";
import { SECTIONS_Lists_TABLE_QUERY_KEY } from "../..";
import useUpdateSection from "../../hooks/useUpdateSection";
import { editSectionSchema } from "../../schemas/editSectionSchema";
import { ISection, ISubSection } from "../../types/section";
import { fetchSectionsClient } from "../../services/sections";

interface IEditSectionFormProps {
  data: ISection;
  sectionType: string;
  parent_section?: ISection;

  onSuccess?: () => void;
}

const defaultValues: editSectionSchema = {
  name: "",
  image: null,
};

export default function EditSectionForm({
  data,
  onSuccess,
  parent_section,
  sectionType,
}: IEditSectionFormProps) {
  const { mutate, isPending } = useUpdateSection(); // Updated hook
  const formT = useTranslations("Dashboard.SectionPage"); // Updated translation key

  const form = useForm<editSectionSchema>({
    resolver: zodResolver(editSectionSchema(formT)),
    defaultValues,
  });

  function onSubmit(values: editSectionSchema) {
    const dirtyValues =
      getDirtyValues(form.formState.dirtyFields, values) ?? {};
    mutate(
      { id: data.id, sectionData: dirtyValues },
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
        name: data.name || "",
        image: data?.image
          ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/${data?.image}`
          : "", // Reset image field
        parent_id: parent_section?.id.toString(),
      });
    }
  }, [data, form, parent_section]);

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <fieldset disabled={isPending} className="space-y-6">
            <FormDropZone<editSectionSchema> name="image" />

            <FormInput<editSectionSchema> name="name" />
            {sectionType === "SUB_CATIGORIES" && (
              <FormSelectWithMapper<editSectionSchema, ISubSection>
                name="parent_id"
                placeholder={formT("namePlaceholder")}
                label={formT("name")}
                queryKey={[SECTIONS_Lists_TABLE_QUERY_KEY]}
                fetchFn={() => fetchSectionsClient({ type: "CATIGORIES" })}
                getOptionArray={(data) => data?.sections?.data ?? []}
                getOptionLabel={(c) => c.name}
                getOptionValue={(c) => c.id}
                className="w-full"
              />
            )}
            <Button
              disabled={isPending || !form.formState.isDirty}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isPending ? (
                <div className="flex items-center space-x-2">
                  <Spinner className="w-4 h-4" />
                  <span>{formT("updatingButton")}</span>
                </div>
              ) : (
                formT("updateButton")
              )}
            </Button>
          </fieldset>
        </form>
      </Form>
    </div>
  );
}
