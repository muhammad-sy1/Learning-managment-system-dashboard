"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useQueryParams } from "./useQueryParams";
import Cookies from "js-cookie";

type UseTableQueryOptions<TData> = {
  queryKey: (string | number | Record<string, string | string[]> | undefined)[];
  fetchFn: (params: Record<string, unknown>) => Promise<TData>;
  options?: Omit<UseQueryOptions<TData>, "queryKey" | "queryFn">;
};

export function useTableQuery<TData>({
  queryKey,
  fetchFn,
  ...options
}: UseTableQueryOptions<TData>) {
  const filters = useQueryParams();

  const query = useQuery({
    queryKey: [...queryKey, filters],
    queryFn: () => fetchFn(filters),
    enabled: !!Cookies.get("token"),
    ...options,
  });

  return query;
}
