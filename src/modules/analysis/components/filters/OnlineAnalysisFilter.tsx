"use client";

import { Form } from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import FormInput from "@/components/form-fields/FormInput";
import { Button } from "@/components/ui/button";
import useSearchForm from "@/hooks/useSearchForm";
import { OnlineAnalysisSchema } from "../../schemas/onlineAnalysisSchema";

const defaultValues = {
    minutes: 0,
};

export default function OnlineAnalysisFilter() {
    const t = useTranslations("Dashboard.analysis.filters");
    const form = useForm<OnlineAnalysisSchema>({
        defaultValues,
    });
    useSearchForm<OnlineAnalysisSchema>({
        form,
    });

    return (
        <Form {...form}>
            <form className="flex flex-wrap gap-4 items-end">
                <FormInput<OnlineAnalysisSchema>
                    name="minutes"
                    placeholder={t("minutesPlaceholder")}
                    label={t("minutesLabel")}
                    className=""
                />

                <Button
                    type="reset"
                    variant="outline"
                    // onClick={() => form.reset(defaultValues)}
                    onClick={() =>
                        form.reset({
                            ...defaultValues,
                        })
                    }
                >
                    {t("reset")}
                </Button>
            </form>
        </Form>
    );
}
