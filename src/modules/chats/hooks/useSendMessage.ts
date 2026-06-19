// hooks/useCreateProvince.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CONVERSATION_QUERY_KEY } from "..";
import { SendMessage } from "../services/chtas";

export default function useSendMessage() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.ChatsPage.messages");

  return useMutation({
    mutationFn: SendMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CONVERSATION_QUERY_KEY],
      });
      toast(t("replySuccess"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}
