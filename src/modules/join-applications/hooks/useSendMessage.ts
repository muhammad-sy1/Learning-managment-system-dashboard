import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { APPLICATIONS_TABLE_QUERY_KEY } from "..";
import { SendMessage } from "../services/applications";

export default function useSendMessage() {
    const queryClient = useQueryClient();
    const t = useTranslations("Dashboard.applicationsPage.sendMessage");

    return useMutation({
        mutationFn: ({
            id,
        }: {
            id: number | string;
        }) => SendMessage(id),
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
