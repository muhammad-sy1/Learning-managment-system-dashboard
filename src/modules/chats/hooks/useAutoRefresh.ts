import { useEffect, useRef } from "react";

export function useAutoRefresh(refetch: () => void, isActive: boolean): void {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      refetch();
    }, 20000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [refetch, isActive]);
}
