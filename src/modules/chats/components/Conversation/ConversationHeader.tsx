import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { ArrowLeft, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import useCloseConvesation from "../../hooks/useCloseConvesation";
import { usePermissionStore } from "@/hooks/usePermissionStore";

const ConversationHeader = ({
  conversation,
  conversationId,
}: {
  conversation: any;
  conversationId: number | string;
}) => {
  const { mutate, isPending: isClosingPending } = useCloseConvesation();
  const t = useTranslations("Dashboard.ChatsPage");

  const router = useRouter();
  const locale = useLocale();
  const { canClose } = usePermissionStore();

  const handleCloseConversation = async () => {
    if (!conversationId) return;
    mutate(Number(conversationId), {
      onSuccess: () => {
        router.push(`/${locale}/dashboard/chats`);
      },
    });
  };
  const user = conversation?.conversation?.user;
  const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim();
  return (
    <div>
      <div className="">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-white shadow-sm">
                  {conversation?.conversation?.user?.image && (
                    <AvatarImage
                      src={
                        process.env.NEXT_PUBLIC_IMAGE_URL +
                        conversation?.conversation?.user?.image
                      }
                    />
                  )}

                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-semibold">
                    {conversation?.conversation?.user?.first_name?.charAt(0)}
                    {conversation?.conversation?.user?.last_name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-lg ">
                  {user ? (
                    fullName ? (
                      fullName
                    ) : (
                      <span className="text-gray-400 italic">
                        {/* {t("userWithoutName")} */}
                        __
                      </span>
                    )
                  ) : (
                    <span className="text-red-400">{t("userNotFound")}</span>
                  )}
                </h3>
              </div>
            </div>
          </div>
          {canClose("chats") &&
            (conversation?.conversation.status === "CLOSED" ? (
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {t("actions.back")}
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleCloseConversation}
                disabled={isClosingPending}
                className="flex items-center gap-2"
              >
                {isClosingPending ? (
                  <>
                    <Spinner className="h-4 w-4" />
                    {t("actions.leaving")}
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4" />
                    {t("actions.close")}
                  </>
                )}
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ConversationHeader;
