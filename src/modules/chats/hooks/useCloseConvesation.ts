// hooks/useCreateProvince.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { CHATS_COVERSATIONS_QUERY_KEY } from "..";
import { CloseConversation } from "../services/chtas";

export default function useCloseConvesation() {
  const queryClient = useQueryClient();
  const t = useTranslations("Dashboard.ChatsPage.messages");

  return useMutation({
    mutationFn: CloseConversation,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [CHATS_COVERSATIONS_QUERY_KEY],
      });
      toast(t("closeSuccess"));
    },
    onError: (error) => {
      toast(error.message);
    },
  });
}
