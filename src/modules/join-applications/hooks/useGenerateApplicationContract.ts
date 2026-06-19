import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { ContractGenerationSchema } from "../schemas/contractGenerationSchema";
import { generateApplicationContract } from "../services/applications";
import { APPLICATIONS_TABLE_QUERY_KEY } from "..";

export default function useGenerateApplicationContract() {
    const queryClient = useQueryClient();
    const t = useTranslations("Dashboard.applicationsPage.contractGenerationForm");

    return useMutation({
        mutationFn: ({
            id,
            contractData,
        }: {
            id: number | string;
            contractData: ContractGenerationSchema;
        }) => generateApplicationContract(id, contractData as any),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [APPLICATIONS_TABLE_QUERY_KEY],
            });
            toast.success(t("success"));
        },
        onError: (error) => {
            toast.error(error.message || t("error"));
        },
    });
}
