import ChatsListPage from "@/modules/chats/components/ChatsListPage/ChatsListPage";
import ChatsFilters from "@/modules/chats/components/filters/ChatsFilters";

const ChatsPage = () => {
  return (
    <div className="space-y-6">
      <ChatsFilters />
      <ChatsListPage />
    </div>
  );
};

export default ChatsPage;
