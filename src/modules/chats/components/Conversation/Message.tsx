import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { Bot, CheckCheck, User } from "lucide-react";
import React from "react";

const Message = ({
  message,
  conversation,
}: {
  message: any;
  conversation: any;
}) => {
  return (
    <div
      key={message.id}
      className={`flex ${
        message.sender_type === "user" ? "justify-start" : "justify-end"
      } group`}
    >
      <div className="flex items-start gap-3 max-w-[75%]">
        {message.sender_type === "user" && (
          <Avatar className="h-8 w-8 mt-1">
            <AvatarFallback className="bg-slate-200 text-slate-600 text-xs">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}

        <div className="space-y-1">
          <div
            className={`flex ${
              message.sender_type === "user" ? "justify-start" : "justify-end"
            } px-2`}
          >
            <span className="text-xs text-muted-foreground">
              {message.sender_type === "user"
                ? `${conversation?.conversation?.user?.first_name || ""} ${
                    conversation?.conversation?.user?.last_name || ""
                  }`
                : "admin"}
            </span>
          </div>

          <div
            className={`rounded-2xl px-4 py-3 ${
              message.sender_type === "user"
                ? "bg-white border border-slate-200 text-slate-800 shadow-sm"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
            } ${
              message.sender_type === "user" ? "rounded-tl-md" : "rounded-tr-md"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {message.body?.replace(/\n/g, "\n") || ""}
            </p>
          </div>

          <div
            className={`flex items-center gap-2 px-2 ${
              message.sender_type === "user" ? "justify-start" : "justify-end"
            }`}
          >
            <CheckCheck className="h-3 w-3 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(message.created_at), {
                addSuffix: true,
                locale: ar,
              })}
            </p>
          </div>
        </div>

        {message.sender_type !== "user" && (
          <Avatar className="h-8 w-8 mt-1">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
};

export default Message;
