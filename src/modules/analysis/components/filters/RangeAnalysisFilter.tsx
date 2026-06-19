"use client";

import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import useSearchForm from "@/hooks/useSearchForm";
import { RangeAnalysisSchema } from "../../schemas/rangeAnalysisSchema";

const defaultValues: RangeAnalysisSchema = {
  from: "",
  to: "",
};

export default function RangeAnalysisFilter() {
  const t = useTranslations("Dashboard.analysis.rangeFilters");
  const form = useForm<RangeAnalysisSchema>({ defaultValues });
  useSearchForm<RangeAnalysisSchema>({ form });

  return (
    <Form {...form}>
      <form className="flex flex-wrap gap-4 items-end">
        <FormField
          control={form.control}
          name="from"
          render={({ field }) => (
            <FormItem className="flex-1 min-w-[200px]">
              <FormLabel className="text-xs text-muted-foreground">{t("from")}</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem className="flex-1 min-w-[200px]">
              <FormLabel className="text-xs text-muted-foreground">{t("to")}</FormLabel>
              <FormControl>
                <Input type="datetime-local" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="reset"
          variant="outline"
          onClick={() => form.reset(defaultValues)}
        >
          {t("reset")}
        </Button>
      </form>
    </Form>
  );
}
