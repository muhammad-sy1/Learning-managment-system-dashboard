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
import useCreateCategory from "../../hooks/useCreateCategory";
import {
  categorySchema,
  CategorySchemaInput,
} from "../../schemas/categorySchema";
import { fetchCategoriesClient } from "../../services/categories";

const defaultValues: CategorySchemaInput = {
  name: "",
  student_type: "",
  parent_id: undefined,
  is_active: 1,
};

export default function AddCategoryForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const t = useTranslations("Dashboard.CategoriesPage");
  const { mutate, isPending } = useCreateCategory();
  const form = useForm<CategorySchemaInput>({
    resolver: zodResolver(categorySchema(t)),
    defaultValues,
  });

  useEffect(() => {
    if (!isPending) {
      form.reset(defaultValues);
    }
  }, [isPending]);

  function onSubmit(values: CategorySchemaInput) {
    mutate(values, { onSuccess });
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
            disabled={isPending}
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {isPending ? (
              <div className="flex items-center space-x-2">
                <Spinner className="w-4 h-4" />
                <span>{t("creatingButton")}</span>
              </div>
            ) : (
              t("createButton")
            )}
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}
