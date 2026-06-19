"use client";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import useSearchForm from "@/hooks/useSearchForm";
import { HourlyUsageSchema } from "../../schemas/hourlyUsageSchema";

const defaultValues: HourlyUsageSchema = {
    date: "",
};

export default function HourlyUsageAnalyticsFilter() {
    const t = useTranslations("Dashboard.analysis.hourlyFilters");

    const form = useForm<HourlyUsageSchema>({
        defaultValues,
    });

    useSearchForm<HourlyUsageSchema>({ form });

    return (
        <Form {...form}>
            <form className="flex flex-wrap gap-4 items-end">

                <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                        <FormItem className="flex-1 min-w-[200px]">
                            <FormLabel className="text-xs text-muted-foreground">
                                {t("dateLabel")}
                            </FormLabel>

                            <FormControl>
                                <Input type="date" {...field} />
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