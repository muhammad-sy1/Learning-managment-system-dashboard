import ConversationView from "@/modules/chats/components/Conversation/ConversationView";
import { Suspense } from "react";

const MessagesPage = () => {
  return (
    <div>
      <Suspense fallback={<div>loading conversation...</div>}>
        <ConversationView />
      </Suspense>
    </div>
  );
};

export default MessagesPage;
