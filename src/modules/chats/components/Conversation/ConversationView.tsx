"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGetConversation } from "../../hooks/useGetConversation";
import { IMessage } from "../../types/chats";
import ConversationHeader from "./ConversationHeader";
import ConversationSkeleton from "./ConversationSkeleton";
import EmptyMessages from "./EmptyMessages";
import Message from "./Message";
import MessageInput from "./MessageInput";

export default function ConversationView() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("conversation");
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [lastMessageId, setLastMessageId] = useState<number | null>(null);
  const [allMessages, setAllMessages] = useState<IMessage[]>([]);
  const t = useTranslations("Dashboard.ChatsPage");
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const {
    data: conversationData,
    isPending,
    refetch,
  } = useGetConversation(
    Number(conversationId),

    isInitialLoad ? true : undefined,
    !isInitialLoad && lastMessageId ? lastMessageId : undefined
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (conversationId) {
      if (isInitialLoad) {
        setIsInitialLoad(false);
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        if (conversation?.conversation.status === "OPEN") {
          refetch();
        }
      }, 20000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [conversationId, refetch]);

  const conversation = conversationData?.data;
  const messages = useMemo(() => conversation?.messages || [], [conversation]);

  useEffect(() => {
    if (messages && messages.length > 0) {
      const latestMessageId = messages[messages.length - 1].id;
      setLastMessageId(latestMessageId);
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [allMessages]);

  useEffect(() => {
    if (conversationData?.data?.messages) {
      const newMessages = conversationData.data.messages;
      if (isInitialLoad) {
        setAllMessages(newMessages);
      } else {
        setAllMessages((prevMessages) => {
          const messageMap = new Map();

          prevMessages.forEach((msg) => messageMap.set(msg.id, msg));

          newMessages.forEach((msg) => messageMap.set(msg.id, msg));

          return Array.from(messageMap.values()).sort(
            (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime()
          );
        });
      }
    }
  }, [conversationData, isInitialLoad]);

  useEffect(() => {
    if (allMessages.length > 0) {
      const latestMessageId = allMessages[allMessages.length - 1].id;
      setLastMessageId(latestMessageId);
    }
  }, [allMessages]);

  if (!conversationId) return null;

  if (isPending || isInitialLoad) {
    return <ConversationSkeleton />;
  }
  return (
    <Card className=" mt-4">
      <CardHeader className="border-b">
        <ConversationHeader
          conversationId={conversationId}
          conversation={conversation}
        />
      </CardHeader>

      <CardContent className={"h-100 overflow-y-auto px-6  space-y-6"}>
        <div className="h-full overflow-y-auto px-6 py-2 space-y-6">
          {allMessages.length === 0 ? (
            <EmptyMessages t={t} />
          ) : (
            allMessages.map((message, index) => (
              <Message
                key={message.id}
                message={message}
                conversation={conversation}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <Separator />
      <MessageInput
        conversation={conversation}
        conversationId={conversationId}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
      />
    </Card>
  );
}
