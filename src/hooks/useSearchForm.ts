"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { debounce } from "@/lib/utils";
import { useRouter } from "@/i18n/navigation";

type UseFilterSyncOptions<T extends FieldValues> = {
  form: UseFormReturn<T>;
    pageKey?: string;

};

const isArrayField = (key: string, value: unknown) => {
  if (Array.isArray(value)) return true;
  return false;
};

export default function useSearchForm<T extends FieldValues>({
  form,
   pageKey = "page",
}: UseFilterSyncOptions<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const formValues: Record<string, any> = {};

    const defaultValues = form.getValues(); 
    for (const key of Object.keys(defaultValues)) {
      const paramValue = searchParams.get(key);

      if (paramValue !== null) {
        if (isArrayField(key, defaultValues[key])) {
          formValues[key] = paramValue.split(",").filter((v) => v.length > 0);
        } else {
          formValues[key] = paramValue;
        }
      }
    }
    if (Object.keys(formValues).length > 0) {
      form.reset({
        ...defaultValues,
        ...formValues,
      });
    }
  }, [searchParams, form]);

  useEffect(() => {
    const updateParams = debounce(
      (values: Record<string, unknown>, name?: string) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(values).forEach(([k, v]) => {
          if (
            v !== undefined &&
            v !== null &&
            v !== "" &&
            (!Array.isArray(v) || v.length > 0)
          ) {
            params.set(k, String(v));
          } else {
            params.delete(k);
          }
        });

        // if (name !== "page" && params.has("page")) {
        //   params.set("page", "1");
        // }
if (name !== pageKey && params.has(pageKey)) {
  params.set(pageKey, "1");
}
        router.replace("?" + params.toString(), { scroll: false });
      },
      500
    );

    const subscription = form.watch((values, { name }) => {
      updateParams(values, name);
    });

    return () => subscription.unsubscribe();
  }, [form, router, searchParams]);
}
