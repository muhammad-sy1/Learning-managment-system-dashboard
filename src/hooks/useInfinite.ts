import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

export interface IInfiniteQueryOptions<T> {
  queryKey: unknown[];
  fetchFn: (
    page: number,
    options?: { signal?: AbortSignal }
  ) => Promise<IPaginatedResponse<T>>;
  refetchInterval?: number;
  enabled?: boolean;
  initialData?: IPaginatedResponse<T>;
}

function useInfinite<T>({
  queryKey,
  fetchFn,
  refetchInterval,
  enabled = true,
}: IInfiniteQueryOptions<T>) {
  const result = useInfiniteQuery<
    IPaginatedResponse<T>,
    IErrorResponse,
    InfiniteData<IPaginatedResponse<T>>,
    typeof queryKey,
    number
  >({
    queryKey,
    refetchInterval,
    queryFn: ({ pageParam = 1, signal }) => fetchFn(pageParam, { signal }),
    getNextPageParam: (lastPage) => {
      const nextPage =
        lastPage.current_page < lastPage.last_page
          ? lastPage.current_page + 1
          : undefined;
      return nextPage;
    },
    initialPageParam: 1,
    enabled,
  });

  const { ref, inView } = useInView({
    threshold: 0.9,
  });

  useEffect(() => {
    if (inView && result.hasNextPage && !result.isFetchingNextPage) {
      result.fetchNextPage();
    }
  }, [
    inView,
    result.hasNextPage,
    result.isFetchingNextPage,
    result.fetchNextPage,
    result,
  ]);
  return {
    ...result,
    ref,
  };
}

export default useInfinite;
