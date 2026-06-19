import { MessageSquare } from "lucide-react";

const EmptyMessages = ({ t }: { t: (key: string) => string }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center space-y-4 p-8">
        <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-6 rounded-2xl inline-block">
          <MessageSquare className="h-12 w-12 text-slate-500 mx-auto" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-black dark:text-gray-100">
            {t("noChats")}
          </h3>
          <p className="text-sm text-muted-foreground max-w-sm">
            {t("noChatsDescription")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyMessages;
