"use client";
import AppPagination from "@/components/reusable-table/AppPagination";
import { MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";
import { useGetChats } from "../../hooks/useGetChats";
import { ChatCard } from "./ChatCard";
import ChatSkeletonList from "./ChatSkeletonList";

function ChatsListPage() {
  const { data, isPending } = useGetChats();
  const allChats = data?.data.conversations.data;
  const t = useTranslations("Dashboard.ChatsPage");

  if (isPending) {
    return <ChatSkeletonList />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-1">
        <div>
          <h1 className="text-3xl font-bold dark:text-white flex items-center gap-2">
            <MessageSquare className="h-8 w-8 dark:text-white" />
            {t("title")}
          </h1>
        </div>
      </div>

      <div className="grid gap-6">
        {allChats?.length === 0 ? (
          <div className="text-center py-10">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium dark:text-gray-200 text-black">
              {t("noChats")}
            </h3>
            <p className="text-gray-500 mt-2">{t("noChatsDescription")}</p>
          </div>
        ) : (
          <>
            {allChats?.map((conversation) => (
              <ChatCard
                key={conversation.id}
                conversation={conversation}
                t={t}
              />
            ))}
          </>
        )}
      </div>
      {data?.data.conversations && (
        <AppPagination
          name={"chats"}
          totalItems={data?.data.conversations?.total || 0}
          totalPages={data?.data.conversations?.last_page || 1}
        />
      )}
    </div>
  );
}

export default ChatsListPage;
