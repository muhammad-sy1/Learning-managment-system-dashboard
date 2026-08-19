"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormInput from "@/components/form-fields/FormInput";
import FormSelectWithMapper from "@/components/form-fields/FormSelectWithMapper";
import Spinner from "@/components/ui/spinner";
import { getDirtyValues } from "@/lib/utils";
import useUpdateCategory from "../../hooks/useUpdateCategory";
import {
  categorySchema,
  CategorySchemaInput,
} from "../../schemas/categorySchema";
import { fetchCategoriesClient } from "../../services/categories";
import { ICategory } from "../../types/category";

interface EditCategoryFormProps {
  data: ICategory;
  onSuccess?: () => void;
}

const defaultValues: CategorySchemaInput = {
  name: "",
  student_type: "",
  parent_id: undefined,
  is_active: 1,
};

export default function EditCategoryForm({
  data,
  onSuccess,
}: EditCategoryFormProps) {
  const t = useTranslations("Dashboard.CategoriesPage");
  const { mutate, isPending } = useUpdateCategory();
  const form = useForm<CategorySchemaInput>({
    resolver: zodResolver(categorySchema(t)),
    defaultValues,
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data.name || "",
        student_type: data.student_type || "",
        parent_id: data.parent_id ?? undefined,
        is_active: data.is_active ? 1 : 0,
      });
    }
  }, [data, form]);

  function onSubmit(values: CategorySchemaInput) {
    const dirtyValues =
      getDirtyValues(form.formState.dirtyFields, values) ?? values;
    mutate({ id: data.id, categoryData: dirtyValues }, { onSuccess });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <fieldset disabled={isPending} className="space-y-6">
          <FormInput<CategorySchemaInput>
            name="name"
            label={t("name")}
            placeholder={t("namePlaceholder")}
          />

          <FormInput<CategorySchemaInput>
            name="student_type"
            label={t("studentType")}
            placeholder={t("studentTypePlaceholder")}
          />

          <FormSelectWithMapper<CategorySchemaInput, ICategory>
            name="parent_id"
            label={t("parentCategory")}
            placeholder={t("parentCategoryPlaceholder")}
            queryKey={["categories-parent-list"]}
            fetchFn={async () => ({ data: await fetchCategoriesClient() })}
            getOptionArray={(data) => data ?? []}
            getOptionLabel={(category) => category.name}
            getOptionValue={(category) => category.id}
            className="w-full"
          />

          <Button
            disabled={isPending || !form.formState.isDirty}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {isPending ? (
              <div className="flex items-center space-x-2">
                <Spinner className="w-4 h-4" />
                <span>{t("updatingButton")}</span>
              </div>
            ) : (
              t("updateButton")
            )}
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
