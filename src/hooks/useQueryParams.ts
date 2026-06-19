"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export function useQueryParams() {
  const searchParams = useSearchParams();

  return useMemo(() => {
    const obj: Record<string, string | string[]> = {};
    for (const [key, value] of searchParams.entries()) {
      if (obj[key]) {
        obj[key] = Array.isArray(obj[key])
          ? [...(obj[key] as string[]), value]
          : [obj[key] as string, value];
      } else {
        obj[key] = value;
      }
    }
    return obj;
  }, [searchParams]);
}
