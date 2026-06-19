const ChatSkeletonList = () => {
  return (
    <div className="p-4 pt-8 space-y-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 animate-pulse border-b pb-3"
        >
          <div className="h-12 w-12 rounded-full bg-gray-300" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-1/3" />
            <div className="h-3 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatSkeletonList;
