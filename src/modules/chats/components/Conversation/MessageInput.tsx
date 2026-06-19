"use client";

import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Spinner from "@/components/ui/spinner";
import { SendHorizontal } from "lucide-react";
import { useTranslations } from "next-intl";
import useSendMessage from "../../hooks/useSendMessage";
import { IConversationWithMessages } from "../../types/chats";
import { usePermissionStore } from "@/hooks/usePermissionStore";

interface MessageInputProps {
  conversation?: IConversationWithMessages;
  conversationId: string;
  newMessage: string;
  setNewMessage: React.Dispatch<React.SetStateAction<string>>;
}

export default function MessageInput({
  conversation,
  conversationId,
  setNewMessage,
  newMessage,
}: MessageInputProps) {
  const t = useTranslations("Dashboard.ChatsPage");
  const { mutate: mutateSendMessage, isPending: isSendingPending } =
    useSendMessage();
  const { canSend } = usePermissionStore();

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 160) + "px";
  };

  useEffect(() => {
    resizeTextarea();
  }, [newMessage]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    mutateSendMessage(
      { conversationId: Number(conversationId), message: newMessage },
      {
        onSuccess: () => {
          setNewMessage("");

          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
          }
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isSendingPending) {
      return;
    }

    // Enter → send message / Shift + Enter → new line
    if (e.key === "Enter") {
      if (e.shiftKey) {
        // Shift + Enter: allow browser default (new line)
        return;
      } else {
        // Enter: send message
        e.preventDefault();
        if (newMessage.trim()) {
          handleSendMessage();
        }
      }
    }
  };
  return (
    <div className="">
      {canSend("chats") && (
        <div className="p-4  backdrop-blur-sm">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <Textarea
                ref={textareaRef}
                placeholder={t("typeMessage")}
                value={newMessage}
                disabled={conversation?.conversation.status !== "OPEN"}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className="rounded-2xl max-h-40 overflow-y-auto px-4 py-3 border-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:border-transparent bg-white shadow-sm min-h-12 resize-none"
              />
            </div>

            <Button
              onClick={handleSendMessage}
              className="rounded-full bg-gradient-to-r from-blue-500
               to-indigo-600 hover:from-blue-600 hover:to-indigo-700 
               transition-all duration-200 shadow-md hover:shadow-lg h-12 w-12"
              disabled={
                !newMessage.trim() ||
                isSendingPending ||
                conversation?.conversation.status !== "OPEN"
              }
            >
              {isSendingPending ? (
                <Spinner className="h-5 w-5 text-white" />
              ) : (
                <SendHorizontal className="h-7 w-7 text-white rotate-180" />
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
