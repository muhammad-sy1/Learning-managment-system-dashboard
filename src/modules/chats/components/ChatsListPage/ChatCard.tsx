// components/chats/ChatCard.tsx
import NavLink from "@/components/NavLink";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatUtcToLocal } from "@/utils/formatDate";
import { CheckCircle, Clock, User, XCircle } from "lucide-react";

export function ChatCard({ conversation, t }: any) {
  const getInitials = (f: string, l: string) =>
    `${f?.[0] ?? ""}${l?.[0] ?? ""}`.toUpperCase();

  const truncate = (text: string, len: number) =>
    text?.length > len ? text.slice(0, len) + "..." : text;

  return (
    <Card
      key={conversation.id}
      className={`overflow-hidden transition-all p-0 hover:shadow-md ${
        conversation.status === "OPEN"
          ? "border-l-4 border-l-blue-500"
          : "border-l-4 border-l-gray-300"
      }`}
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row w-full">
          {/* Left Section */}
          <div className="flex-1 p-4 sm:p-6">
            <div className="flex items-start gap-3 sm:gap-4 flex-col sm:flex-row">
              <Avatar className="h-12 w-12 border">
                <AvatarFallback className="text-blue-800">
                  {getInitials(
                    conversation.user?.first_name ?? "-",
                    conversation.user?.last_name ?? ""
                  )}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 w-full">
                {/* Name and Status */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <h3 className="font-semibold text-lg text-center md:text-left">
                    {conversation.user ? (
                      `${conversation.user.first_name ?? "__"} ${
                        conversation.user.last_name ?? ""
                      }`
                    ) : (
                      <span className="text-red-400">{t("userNotFound")}</span>
                    )}
                  </h3>

                  <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 text-sm">
                    <Badge
                      variant={
                        conversation.status === "OPEN" ? "default" : "secondary"
                      }
                      className={`flex items-center gap-1 ${
                        conversation.status === "OPEN"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {conversation.status === "OPEN" ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : (
                        <XCircle className="h-3 w-3" />
                      )}
                      {conversation.status === "OPEN"
                        ? t("statuses.open")
                        : t("statuses.closed")}
                    </Badge>

                    {conversation?.last_message && (
                      <div className="text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatUtcToLocal(conversation.last_message.created_at)}
                      </div>
                    )}
                  </div>
                </div>

                {/* Last message */}
                <p className="text-gray-600 mt-3 text-sm sm:text-base line-clamp-2">
                  {conversation?.last_message &&
                    truncate(conversation.last_message.body, 120)}
                </p>

                {/* Footer info */}
                <div className="flex flex-col sm:flex-row sm:items-center mt-4 gap-2 sm:gap-8 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {t("fields.sender")}:{" "}
                    {conversation.last_message?.sender_type === "user"
                      ? `${t("fields.replyBy")} ${
                          conversation.user?.first_name ?? ""
                        } ${conversation.user?.last_name ?? ""}`
                      : `${t("fields.replyBy")} ${
                          conversation.user?.first_name ?? ""
                        } ${conversation.user?.last_name ?? ""}`}
                  </div>

                  {conversation.last_reply_admin && (
                    <div>
                      {t("fields.last_reply_admin")}:{" "}
                      {conversation.last_reply_admin.first_name}{" "}
                      {conversation.last_reply_admin.last_name}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Section (Button) */}
          <div className="p-4 sm:p-6 md:w-48 flex justify-center md:justify-end items-center md:items-end">
            <NavLink
              href={`/dashboard/messages?conversation=${conversation.id}`}
              className="w-full md:w-auto"
            >
              <Button variant="outline" size="sm" className="w-full md:w-auto">
                {t("actions.view")}
              </Button>
            </NavLink>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
